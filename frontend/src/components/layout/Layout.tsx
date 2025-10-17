import { Box, Container, Flex, Heading, Button, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem, Text } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="blue.600">
              💰 Finance Tracker
            </Heading>

            <HStack spacing={4}>
              <Menu>
                <MenuButton>
                  <HStack spacing={2} cursor="pointer">
                    <Avatar size="sm" name={user?.full_name} bg="blue.500" />
                    <Text fontWeight="medium">{user?.full_name}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Content */}
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
}