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
    <div className="mt-4 p-4 border rounded-lg max-h-[600px] overflow-y-auto bg-white/80 backdrop-blur-sm shadow-lg">
      {history.map((message, index) => (
        <div
          key={index}
          className={cn(
            "my-4",
            message.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'
          )}
        >
          <div className={cn(
            "font-semibold",
            message.role === 'user' ? 'text-purple-600' : 'text-blue-600'
          )}>
            {message.role === 'user' ? '用户：' : '玄机：'}
          </div>
          <div className={cn(
            "p-3 rounded-lg max-w-[80%] shadow-sm",
            message.role === 'user' ? 'bg-purple-50 mr-2' : 'bg-blue-50 ml-2'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={atomDark as any}
                      language={match[1] as any}
                      PreTag={'div'}
                      {...props}
                    />
                  ) : (
                    <code className={cn('bg-purple-100 px-1 py-0.5 rounded text-sm', className)} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
              className={cn(
                "prose max-w-none",
                message.role === 'user' ? 'prose-purple' : 'prose-blue'
              )}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};
