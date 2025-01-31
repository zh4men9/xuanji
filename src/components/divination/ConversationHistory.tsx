'use client';

import { useDivinationStore } from '@/lib/divination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/lib/utils';

export const ConversationHistory = () => {
  const { history } = useDivinationStore();

  return (
    <div className="mt-4 p-4 border rounded-lg max-h-[400px] overflow-y-auto bg-white/80 backdrop-blur-sm shadow-lg">
      {history
        .filter((message) => message.role === 'user')
        .map((message, index) => (
          <div key={index} className="my-2 flex flex-col items-end">
            <div className="font-semibold text-purple-600">
              用户：
            </div>
            <div className="bg-purple-50 p-3 rounded-lg max-w-[80%] mr-2 shadow-sm">
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
                className="prose prose-purple max-w-none"
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
    </div>
  );
};
