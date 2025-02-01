export const MODEL_MAPPING: Record<string, string> = {
  'gemini-1.5-flash-8b-latest': 'gemini-1.5-flash-8b-latest',
  'gemini-1.5-pro-latest': 'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest': 'gemini-1.5-flash-latest', 
  'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp'
};

export const MODEL_OPTIONS = [
  { value: 'gemini-1.5-flash-8b-latest', label: 'Gemini 1.5 Flash 8B (最新版)' },
  { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (最新版)' },
  { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash (最新版)' },
  { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (实验版)' }
];
