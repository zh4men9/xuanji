'use client';

import {
  Box,
  Flex,
  IconButton,
  Button,
  useColorMode,
  useColorModeValue,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Image
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

export const Header = ({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      px={4}
      height="60px"
      position="fixed"
      width="full"
      zIndex={99}
      borderBottomWidth="1px"
      bg={bgColor}
    >
      <Flex h="100%" alignItems="center" justifyContent="space-between">
        {/* Left Section */}
        <HStack spacing={4}>
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            onClick={onMobileMenuOpen}
            variant="ghost"
            aria-label="open menu"
            icon={<HamburgerIcon />}
          />
          <Image 
            src="/logo.png" 
            alt="玄机AI算命系统"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </HStack>

        {/* Right Section */}
        <HStack spacing={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          
          {/* User Menu - Show login button if not logged in */}
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar 
                size="xs"
                sx={{ 
                  width: '24px', 
                  height: '24px',
                  '.chakra-avatar__svg': {
                    width: '16px',
                    height: '16px'
                  }
                }}
              />
            </MenuButton>
            <MenuList>
              <MenuItem>个人中心</MenuItem>
              <MenuItem>历史记录</MenuItem>
              <MenuItem>设置</MenuItem>
              <MenuItem>退出登录</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}; 