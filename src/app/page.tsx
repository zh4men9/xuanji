'use client';

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { DivinationForm } from '@/components/divination/DivinationForm';
import { DivinationResult } from '@/components/divination/DivinationResult';
import { useDivinationStore } from '@/lib/divination';
import { useEffect } from 'react';

export default function Home() {
  const { currentResponse, loadHistory } = useDivinationStore();

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4} color="red.600">
            玄机
          </Heading>
          <Text fontSize="xl" color="gray.600">
            AI 智能算命系统
          </Text>
        </Box>

        {!currentResponse ? <DivinationForm /> : <DivinationResult />}
      </VStack>
    </Container>
  );
} 