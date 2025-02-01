import { Select, FormLabel, FormControl } from '@chakra-ui/react';
import { MODEL_OPTIONS } from '@/constants/models';

export const ModelSelector = ({ value, onChange }) => (
  <FormControl>
    <FormLabel>选择预测模型</FormLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="选择AI模型"
      bg="white"
      borderRadius="lg"
    >
      {MODEL_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </FormControl>
); 