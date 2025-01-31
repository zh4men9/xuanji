'use client';

import { useState } from 'react';
import { useDivinationStore } from '@/lib/divination';
import type { IDivinationRequest } from '@/types/divination.types';

export const DivinationForm = () => {
  const { generateDivination, isLoading } = useDivinationStore();

  const [formData, setFormData] = useState<IDivinationRequest>({
    question: '',
    birthDateTime: '',
    name: '',
    gender: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      alert('请输入您的问题');
      return;
    }

    try {
      await generateDivination(formData);
    } catch (error) {
      alert(error instanceof Error ? error.message : '请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-group">
        <label htmlFor="question" className="form-label">
          您的问题 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="请输入您想问的问题..."
          className="form-textarea"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="birthDateTime" className="form-label">
          出生日期时间
        </label>
        <input
          type="datetime-local"
          id="birthDateTime"
          name="birthDateTime"
          value={formData.birthDateTime}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          姓名
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入您的姓名（选填）"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="gender" className="form-label">
          性别
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">请选择性别（选填）</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '正在算命...' : '开始算命'}
      </button>
    </form>
  );
};
