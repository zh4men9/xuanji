'use client';

import { useDivinationStore } from '@/lib/divination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/lib/utils';

export const DivinationResult = () => {
  const { currentResponse, clearResult } = useDivinationStore();

  if (!currentResponse) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <div className="prose prose-purple max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={cn('bg-purple-100 px-1 py-0.5 rounded text-sm', className)} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {currentResponse}
        </ReactMarkdown>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={clearResult}
          className="px-4 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          返回
        </button>
      </div>
    </div>
  );
};
