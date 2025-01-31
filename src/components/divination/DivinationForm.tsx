'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useDivinationStore } from '@/lib/divination';
import type { IDivinationRequest } from '@/types/divination.types';

export const DivinationForm = () => {
  const toast = useToast();
  const { generateDivination, isLoading } = useDivinationStore();

  const [formData, setFormData] = useState<IDivinationRequest>({
    question: '',
    birthDateTime: '',
    name: '',
    gender: undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast({
        title: '请输入您的问题',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await generateDivination(formData);
    } catch (error) {
      toast({
        title: '算命失败',
        description: error instanceof Error ? error.message : '请稍后重试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxW="600px" mx="auto">
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel>您的问题</FormLabel>
          <Textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="请输入您想问的问题..."
            minH="120px"
          />
        </FormControl>

        <FormControl>
          <FormLabel>出生日期时间</FormLabel>
          <Input
            name="birthDateTime"
            type="datetime-local"
            value={formData.birthDateTime}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>姓名</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入您的姓名（选填）"
          />
        </FormControl>

        <FormControl>
          <FormLabel>性别</FormLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="请选择性别（选填）"
          >
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="red"
          size="lg"
          width="100%"
          isLoading={isLoading}
        >
          开始算命
        </Button>
      </VStack>
    </Box>
  );
};
