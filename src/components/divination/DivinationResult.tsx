'use client';

import {
  Box,
  VStack,
  Text,
  Progress,
  Heading,
  List,
  ListItem,
  ListIcon,
  Button,
  HStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useDivinationStore } from '@/lib/divination';
import { formatFortuneScore, getFortuneColor } from '@/lib/divination';
import { EDivinationType } from '@/types/divination.types';
import { useState } from 'react';

export const DivinationResult = () => {
  const { currentResponse, clearCurrentResult, history, startDivination, isLoading } = useDivinationStore();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const toast = useToast();

  if (!currentResponse) {
    return null;
  }

  const { answer, fortune, advice } = currentResponse;

  const handleFollowUp = async () => {
    if (!followUpQuestion.trim()) {
      toast({
        title: '请输入您的问题',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await startDivination({ question: followUpQuestion }, EDivinationType.GENERAL);
      setFollowUpQuestion('');
    } catch (error) {
      toast({
        title: '提问失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch" width="100%" maxW="800px" mx="auto">
      {/* 对话历史 */}
      <Box>
        <Heading as="h3" size="md" mb={4}>
          对话历史
        </Heading>
        <VStack spacing={4} align="stretch">
          {history.map((item, index) => (
            <Box 
              key={item.id} 
              p={4} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg={index === 0 ? 'white' : 'gray.50'}
            >
              <Text fontWeight="bold" mb={2}>
                问：{item.request.question}
              </Text>
              <Text whiteSpace="pre-wrap">
                答：{item.response.answer}
              </Text>
              {index === 0 && (
                <>
                  <Box mt={4}>
                    <Heading as="h4" size="sm" mb={3}>
                      运势分析
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text mb={1}>总体运势 ({item.response.fortune.overall}分)</Text>
                        <Progress value={item.response.fortune.overall} colorScheme={getFortuneColor(item.response.fortune.overall)} />
                      </Box>
                      <Box>
                        <Text mb={1}>感情运势 ({item.response.fortune.love}分)</Text>
                        <Progress value={item.response.fortune.love} colorScheme={getFortuneColor(item.response.fortune.love)} />
                      </Box>
                      <Box>
                        <Text mb={1}>事业运势 ({item.response.fortune.career}分)</Text>
                        <Progress value={item.response.fortune.career} colorScheme={getFortuneColor(item.response.fortune.career)} />
                      </Box>
                      <Box>
                        <Text mb={1}>财运 ({item.response.fortune.wealth}分)</Text>
                        <Progress value={item.response.fortune.wealth} colorScheme={getFortuneColor(item.response.fortune.wealth)} />
                      </Box>
                      <Box>
                        <Text mb={1}>健康运势 ({item.response.fortune.health}分)</Text>
                        <Progress value={item.response.fortune.health} colorScheme={getFortuneColor(item.response.fortune.health)} />
                      </Box>
                    </VStack>
                  </Box>

                  <Box mt={4}>
                    <Heading as="h4" size="sm" mb={3}>
                      大师建议
                    </Heading>
                    <List spacing={2}>
                      {item.response.advice.map((adviceItem, i) => (
                        <ListItem key={i} display="flex" alignItems="center">
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          <Text>{adviceItem}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* 继续提问 */}
      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white">
        <Heading as="h3" size="md" mb={4}>
          继续提问
        </Heading>
        <VStack spacing={4}>
          <Textarea
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            placeholder="请输入您的后续问题..."
            minH="100px"
          />
          <HStack width="100%" spacing={4}>
            <Button
              onClick={handleFollowUp}
              colorScheme="red"
              size="lg"
              flex={1}
              isLoading={isLoading}
            >
              继续提问
            </Button>
            <Button
              onClick={clearCurrentResult}
              colorScheme="gray"
              variant="outline"
              size="lg"
              flex={1}
            >
              重新开始
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
}; 