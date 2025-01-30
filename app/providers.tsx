'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// 自定义主题
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  colors: {
    brand: {
      50: '#ffe5e5',
      100: '#fbb8b8',
      200: '#f48a8a',
      300: '#ed5c5c',
      400: '#e62e2e',
      500: '#cc1515',
      600: '#a00f0f',
      700: '#730a0a',
      800: '#460505',
      900: '#1d0000',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
} 