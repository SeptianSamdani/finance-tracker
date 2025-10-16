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
  FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: 'Validation error',
        description: 'Password must be at least 6 characters',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({ email, password, full_name: fullName });
      toast({
        title: 'Registration successful',
        description: 'Welcome to Finance Tracker!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong',
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
              Create your account
            </Text>
          </Stack>

          <Card>
            <CardBody>
              <Box as="form" onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      size="lg"
                    />
                  </FormControl>

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
                        placeholder="Create a password"
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
                    <FormHelperText>
                      Password must be at least 6 characters
                    </FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                  >
                    Sign Up
                  </Button>

                  <Text textAlign="center">
                    Already have an account?{' '}
                    <Link href="/login" color="blue.500" fontWeight="semibold">
                      Sign in
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