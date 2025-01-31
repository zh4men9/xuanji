'use client';

import { Box, Text } from '@chakra-ui/react';
import { useDivinationStore } from '@/lib/divination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const ConversationHistory = () => {
  const { history } = useDivinationStore();

  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="md" maxH="400px" overflowY="auto">
      {history.map((message, index) => (
        <Box key={index} my={2} alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'} >
          <Text fontWeight="bold" color={message.role === 'user' ? 'blue.500' : 'green.500'}>
            {message.role === 'user' ? '用户：' : 'AI：'}
          </Text>
          <Box
            bg={message.role === 'user' ? 'blue.50' : 'green.50'}
            p={2}
            borderRadius="md"
            maxWidth="80%"
            ml={message.role === 'assistant' ? 2 : 0}
            mr={message.role === 'user' ? 2 : 0}
          >
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
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
