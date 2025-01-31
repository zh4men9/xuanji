'use client';

import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { useDivinationStore } from '@/lib/divination';
import { Button } from '@chakra-ui/react';

export const DivinationResult = () => {
  const { currentResponse, clearResult } = useDivinationStore();

  if (!currentResponse) {
    return <Text>No divination result to display.</Text>;
  }

  const { fortune, advice, answer, timestamp } = currentResponse;

  return (
    <Box padding={4} borderWidth="1px" borderRadius="md">
      <VStack spacing={4} align="stretch">
        <Box textAlign="center">
          <Heading as="h2" size="lg">
            算命结果
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {timestamp && new Date(timestamp).toLocaleString()}
          </Text>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2}>
            运势分析
          </Heading>
          <Text>总体运势: {fortune?.overall}</Text>
          <Text>感情运势: {fortune?.love}</Text>
          <Text>事业运势: {fortune?.career}</Text>
          <Text>财运: {fortune?.wealth}</Text>
          <Text>健康运势: {fortune?.health}</Text>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2}>
            AI 解答
          </Heading>
          <Text whiteSpace="pre-line">{answer}</Text>
        </Box>

        {advice && advice.length > 0 && (
          <Box>
            <Heading as="h3" size="md" mb={2}>
              建议
            </Heading>
            <ul>
              {advice.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Box>
        )}

        <Button colorScheme="red" onClick={clearResult}>
          重新算命
        </Button>
      </VStack>
    </Box>
  );
};
