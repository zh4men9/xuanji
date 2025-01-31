'use client';

import { Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useDivinationStore } from '@/lib/divination';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const DivinationResult = () => {
  const { currentResponse, clearResult } = useDivinationStore();

  if (!currentResponse) {
    return <Text>No divination result to display.</Text>;
  }

  return (
    <Box padding={4} borderWidth="1px" borderRadius="md">
      <VStack spacing={4} align="stretch">
        <Box textAlign="center">
          <Heading as="h2" size="lg">
            算命结果
          </Heading>
        </Box>

        <Box>
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
            {currentResponse}
          </ReactMarkdown>
        </Box>

        <Button colorScheme="red" onClick={clearResult}>
          重新算命
        </Button>
      </VStack>
    </Box>
  );
};
