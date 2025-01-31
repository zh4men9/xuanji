'use client';

import { useState } from 'react';
import { useDivinationStore } from '@/lib/divination';
import type { IDivinationRequest } from '@/types/divination.types';

export const DivinationForm = () => {
  const { generateDivination, isLoading, userInfo } = useDivinationStore();
  const [question, setQuestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('请输入您的问题');
      return;
    }

    try {
      await generateDivination({
        question,
        ...userInfo
      });
      setQuestion('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="请输入您想问的问题..."
            className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all resize-none"
            rows={2}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? '思考中...' : '提问'}
        </button>
      </div>
    </form>
  );
};
