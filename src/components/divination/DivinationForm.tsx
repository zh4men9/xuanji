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
import { EDivinationType, IDivinationRequest } from '@/types/divination.types';

/**
 * 算命表单组件
 */
export const DivinationForm = () => {
  const toast = useToast();
  const { startDivination, isLoading } = useDivinationStore();

  // 表单状态
  const [formData, setFormData] = useState<IDivinationRequest>({
    question: '',
    birthDateTime: '',
    name: '',
    gender: undefined,
  });

  // 算命类型
  const [type, setType] = useState<EDivinationType>(EDivinationType.GENERAL);

  // 处理表单提交
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
      await startDivination(formData, type);
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

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%" maxW="600px" mx="auto">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>您想问什么？</FormLabel>
          <Textarea
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="例如：我最近的事业运势如何？"
            minH="100px"
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

        <FormControl>
          <FormLabel>算命类型</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as EDivinationType)}
          >
            <option value={EDivinationType.GENERAL}>综合运势</option>
            <option value={EDivinationType.LOVE}>感情运势</option>
            <option value={EDivinationType.CAREER}>事业运势</option>
            <option value={EDivinationType.WEALTH}>财运</option>
            <option value={EDivinationType.HEALTH}>健康运势</option>
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