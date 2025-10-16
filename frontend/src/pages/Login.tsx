import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <Stack spacing={8}>
          <Stack align="center" spacing={2}>
            <Heading fontSize="4xl" color="blue.600">
              💰 Finance Tracker
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Sign in to manage your finances
            </Text>
          </Stack>

          <Card>
            <CardBody>
              <Box as="form" onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>

                  <Text textAlign="center">
                    Don't have an account?{' '}
                    <Link href="/register" color="blue.500" fontWeight="semibold">
                      Sign up
                    </Link>
                  </Text>
                </Stack>
              </Box>
            </CardBody>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}