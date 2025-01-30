# gemini_api.py

import os
import json
import mimetypes
import hashlib
import time
import random
from typing import List, Dict, Any, Callable
import google.generativeai as genai


def retry_api_call(max_retries: int = 3, backoff_factor: float = 1.5, initial_wait: float = 3.0):
    """
    用于自动重试大模型API调用的装饰器。
    - max_retries: 最大重试次数
    - backoff_factor: 指数回退系数
    - initial_wait: 初始等待秒数
    """
    def decorator(func: Callable):
        def wrapper(*args, **kwargs):
            wait_time = initial_wait
            for attempt in range(1, max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"[retry_api_call] 第 {attempt} 次调用失败，错误: {e}")
                    if attempt == max_retries:
                        print("[retry_api_call] 已达到最大重试次数，抛出异常。")
                        raise e
                    else:
                        print(f"等待 {wait_time:.1f} 秒后重试...")
                        time.sleep(wait_time)
                        wait_time *= backoff_factor
        return wrapper
    return decorator


class GeminiAPI:
    """
    优化后的 GeminiAPI 类：
    - 保留原逻辑，如文件上传缓存、generate_content 系列方法等；
    - 在长耗时方法上增加随机延迟与 retry_api_call 装饰器；
    """

    def __init__(self, api_key=None, proxies=None, default_model: str = "models/gemini-2.0-flash-exp"):
        # 读取API Key
        self.api_key = api_key or os.environ.get("GOOGLE_API_KEY")
        if self.api_key is None:
            raise ValueError("API key not provided. Set GOOGLE_API_KEY or pass api_key to the constructor.")

        # 配置 generative ai
        genai.configure(api_key=self.api_key)

        self.proxies = proxies
        self._model_info = {}
        self.default_model = default_model
        self.model_instance = genai.GenerativeModel(self.default_model)

        # 缓存：sha256 -> UploadedFile
        self._uploaded_files_cache: Dict[str, genai.types.UploadedFile] = {}

    def list_models(self) -> List[Dict[str, Any]]:
        """列出可用的模型信息，并写入 gemini_model.json"""
        models = genai.list_models()
        models_info = []

        for model in models:
            model_data = {
                "name": model.name,
                "baseModelId": model.base_model_id,
                "version": model.version,
                "displayName": model.display_name,
                "description": model.description,
                "inputTokenLimit": model.input_token_limit,
                "outputTokenLimit": model.output_token_limit,
                "supportedGenerationMethods": model.supported_generation_methods,
                "temperature": model.temperature,
                "maxTemperature": model.max_temperature,
                "topP": model.top_p,
                "topK": model.top_k
            }
            models_info.append(model_data)
            self._model_info[model.name] = model_data

        with open("gemini_model.json", "w", encoding="utf-8") as f:
            json.dump({"models": models_info}, f, indent=4, ensure_ascii=False)
        return models_info

    @retry_api_call(max_retries=3, backoff_factor=1.5, initial_wait=3.0)
    def generate_content(self,
                         prompt: str,
                         model: str = None,
                         file_paths: List[str] = None,
                         parameters: Dict[str, Any] = None,
                         output_json_format: bool = False) -> str:
        """
        非对话模式文本生成。
        可选随机延迟，以防调用过于频繁。
        """
        # 随机延迟避免请求过于密集
        time.sleep(random.uniform(1.0, 3.0))

        model_to_use = model or self.default_model
        if model_to_use != self.default_model:
            model_instance = genai.GenerativeModel(model_to_use)
        else:
            model_instance = self.model_instance

        contents = self._build_content(prompt, file_paths)
        response = model_instance.generate_content(contents=contents, generation_config=parameters)
        return self._format_response(response.text, output_json_format)

    @retry_api_call(max_retries=3, backoff_factor=1.5, initial_wait=3.0)
    def generate_chat_response(self,
                               messages: List[Dict[str, str]],
                               model: str = None,
                               file_paths: List[str] = None,
                               parameters: Dict[str, Any] = None,
                               output_json_format: bool = False) -> str:
        """
        对话模式文本生成。
        同样加上随机延迟和重试机制。
        """
        time.sleep(random.uniform(1.0, 3.0))

        model_to_use = model or self.default_model
        if model_to_use != self.default_model:
            model_instance = genai.GenerativeModel(model_to_use)
        else:
            model_instance = self.model_instance

        contents = self._build_chat_content(messages, file_paths)
        response = model_instance.generate_content(contents=contents, generation_config=parameters)
        return self._format_response(response.text, output_json_format)

    def _build_content(self, prompt, file_paths=None):
        parts = [{"text": prompt}]
        if file_paths:
            for file_path in file_paths:
                uploaded_file = self.upload_file(file_path)
                if uploaded_file:
                    parts.append(uploaded_file)
        return parts

    def _build_chat_content(self, messages, file_paths=None):
        contents = []
        for message in messages:
            role = message.get("role")
            content_text = message.get("content")
            if role and content_text:
                parts = [{"text": content_text}]
                contents.append({"role": role, "parts": parts})

        if file_paths:
            for file_path in file_paths:
                uploaded_file = self.upload_file(file_path)
                if uploaded_file:
                    contents.append({"role": "user", "parts": [uploaded_file]})
        return contents

    def _format_response(self, response_text: str, output_json_format: bool) -> str:
        if output_json_format:
            return json.dumps({"response": response_text}, ensure_ascii=False)
        return response_text

    @retry_api_call(max_retries=3, backoff_factor=1.5, initial_wait=3.0)
    def upload_file(self, file_path: str):
        """
        上传文件，如已存在则返回缓存对象。
        """
        file_name = os.path.basename(file_path)
        mime_type = mimetypes.guess_type(file_path)[0]
        if not mime_type:
            print(f"[upload_file] 无法确定文件'{file_path}'的MIME类型，跳过上传。")
            return None

        with open(file_path, "rb") as f:
            file_content = f.read()
            sha256_hash = hashlib.sha256(file_content).hexdigest()

        # 查看本地缓存
        if sha256_hash in self._uploaded_files_cache:
            return self._uploaded_files_cache[sha256_hash]

        # 查看远端已上传列表
        existing_files = genai.list_files()
        for existing_file in existing_files:
            existing_file_hash_str = existing_file.sha256_hash.decode('utf-8')
            if existing_file_hash_str.lower() == sha256_hash.lower():
                self._uploaded_files_cache[sha256_hash] = existing_file
                return existing_file

        print(f"[upload_file] 正在上传文件 '{file_name}' ...")
        try:
            uploaded_file = genai.upload_file(path=file_path, mime_type=mime_type, display_name=file_name)
            self._uploaded_files_cache[sha256_hash] = uploaded_file
            return uploaded_file
        except Exception as e:
            print(f"[upload_file] 文件'{file_name}'上传失败: {e}")
            return None

    def list_uploaded_files(self):
        """列出所有已上传的文件。"""
        return genai.list_files()

    def delete_uploaded_file(self, file_resource):
        """删除已上传的文件，需要传入文件资源对象。"""
        try:
            genai.delete_file(file_resource.name)
            # 清理缓存
            for file_hash, uploaded_file in list(self._uploaded_files_cache.items()):
                if uploaded_file.name == file_resource.name:
                    del self._uploaded_files_cache[file_hash]
            return True
        except Exception as e:
            print(f"[delete_uploaded_file] 删除文件 '{file_resource.name}' 失败: {e}")
            return False

    def wait_for_files_active(self, files):
        """等待文件变为活动状态(如需要)，中间间隔轮询."""
        print("[wait_for_files_active] 等待文件处理...")
        for file in files:
            file_info = genai.get_file(file.name)
            while file_info.state.name == "PROCESSING":
                print(".", end="", flush=True)
                time.sleep(5)
                file_info = genai.get_file(file.name)
            if file_info.state.name != "ACTIVE":
                raise Exception(f"[wait_for_files_active] 文件 {file.name} 状态非ACTIVE，处理失败。")
        print("文件全部就绪！")

    @retry_api_call(max_retries=3, backoff_factor=1.5, initial_wait=5.0)
    def generate_content_with_pdf(self,
                                  prompt: str,
                                  pdf_file_path: str,
                                  model: str = None,
                                  parameters: Dict[str, Any] = None,
                                  output_json_format: bool = False) -> str:
        """
        使用 PDF 文件进行内容生成（非对话模式）。
        """
        # 额外随机延迟
        time.sleep(random.uniform(3, 5))

        uploaded_file = self.upload_file(pdf_file_path)
        if not uploaded_file:
            return "文件上传失败。"

        model_to_use = model or self.default_model
        if model_to_use != self.default_model:
            model_instance = genai.GenerativeModel(model_to_use)
        else:
            model_instance = self.model_instance

        response = model_instance.generate_content([prompt, uploaded_file], generation_config=parameters)
        return self._format_response(response.text, output_json_format)

    @retry_api_call(max_retries=3, backoff_factor=1.5, initial_wait=5.0)
    def generate_chat_response_with_pdf(self,
                                        messages: List[Dict[str, str]],
                                        pdf_file_path: str,
                                        model: str = None,
                                        prompt: str = "",
                                        parameters: Dict[str, Any] = None,
                                        output_json_format: bool = False) -> str:
        """
        使用 PDF 文件生成聊天回复（对话模式）。
        """
        time.sleep(random.uniform(8.0, 15.0))

        uploaded_file = self.upload_file(pdf_file_path)
        if not uploaded_file:
            return "文件上传失败。"

        model_to_use = model or self.default_model
        if model_to_use != self.default_model:
            model_instance = genai.GenerativeModel(model_to_use)
        else:
            model_instance = self.model_instance

        # 构建消息历史
        history = messages + [{"role": "user", "parts": [uploaded_file]}]
        chat = model_instance.start_chat(history=history)
        response = chat.send_message(prompt)
        return self._format_response(response.text, output_json_format)


if __name__ == '__main__':
    """
    简单测试：
    python gemini_api.py
    """
    import dotenv
    dotenv.load_dotenv()

    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("请先在系统环境变量或 .env 文件中设置 GOOGLE_API_KEY")
    else:
        gemini_api = GeminiAPI(api_key=api_key)
        # 你可以在这里做一些简单测试, 例如:
        gemini_api.list_models()
        response = gemini_api.generate_content("Hello Gemini!")
        print(response)
