'use client';

import { Clock, Sparkles } from 'lucide-react';

const recentHistory = [
  { id: 1, title: '八字算命', time: '2024-01-30 15:30' },
  { id: 2, title: '姓名测算', time: '2024-01-29 10:15' },
  { id: 3, title: '风水咨询', time: '2024-01-28 14:20' },
];

const recommendations = [
  { id: 1, title: '2024年运势', description: '了解您的2024年整体运势' },
  { id: 2, title: '事业发展', description: '职业规划和事业发展指导' },
  { id: 3, title: '感情分析', description: '感情和婚姻运势解析' },
];

export function RightSidebar() {
  return (
    <div className="space-y-8">
      {/* 最近历史记录 */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} size={14} />
          最近记录
        </h3>
        <ul className="mt-2 divide-y divide-gray-100">
          {recentHistory.map((item) => (
            <li key={item.id} className="py-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 推荐 */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} size={14} />
          推荐测算
        </h3>
        <ul className="mt-2 divide-y divide-gray-100">
          {recommendations.map((item) => (
            <li key={item.id} className="py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 