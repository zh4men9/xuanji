'use client';

import { Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

const recentHistory = [
  { id: 1, title: '八字算命', time: '2024-01-30 15:30' },
  { id: 2, title: '姓名测算', time: '2024-01-29 10:15' },
  { id: 3, title: '风水咨询', time: '2024-01-28 14:20' },
];

const recommendedQuestions = [
  '我的2024年运势如何？',
  '我适合从事什么行业？',
  '我的感情运势怎么样？',
  '近期财运如何？',
];

export function RightSidebar() {
  return (
    <div className="space-y-6">
      <div className="glass-effect p-6">
        <h3 className="section-title text-lg mb-4">推荐测算</h3>
        <div className="space-y-3">
          {recommendedQuestions.map((question, index) => (
            <Link
              key={index}
              href={`/divination?q=${encodeURIComponent(question)}`}
              className="block p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors text-sm text-text-secondary hover:text-text"
            >
              {question}
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-effect p-6">
        <h3 className="section-title text-lg mb-4">最近记录</h3>
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            登录后可以查看您的历史记录
          </p>
          <Link
            href="/history"
            className="apple-button inline-block text-sm"
          >
            查看历史记录
          </Link>
        </div>
      </div>

      <div className="glass-effect p-6">
        <h3 className="section-title text-lg mb-4">关于玄机</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          玄机是一款基于先进AI技术的算命系统，结合传统命理与现代分析，为您提供专业的命理解析服务。
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm text-primary hover:text-primary-hover transition-colors"
        >
          了解更多 →
        </Link>
      </div>
    </div>
  );
} 