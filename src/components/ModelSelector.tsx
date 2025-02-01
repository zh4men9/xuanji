import { Select, FormLabel, FormControl } from '@chakra-ui/react';
import { MODEL_OPTIONS } from '@/constants/models';
import { FC } from 'react';

export const ModelSelector: FC<{ 
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <FormControl>
    <FormLabel>选择玄机模型</FormLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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