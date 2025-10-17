import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Spinner, Center } from '@chakra-ui/react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Box>{children}</Box>;
}