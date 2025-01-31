'use client';

import { Box, Container, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { DivinationForm } from '@/components/divination/DivinationForm';
import { DivinationResult } from '@/components/divination/DivinationResult';
import { ConversationHistory } from '@/components/divination/ConversationHistory';
import { useDivinationStore } from '@/lib/divination';

export default function Home() {
  const { currentResponse, clearHistory, history } = useDivinationStore();

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

        <ConversationHistory />

        {!currentResponse ? <DivinationForm /> : <DivinationResult />}

        {history.length > 0 && (
          <HStack justifyContent="space-between">
            <Button colorScheme="gray" size="sm" onClick={clearHistory}>
              清除对话历史
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
}