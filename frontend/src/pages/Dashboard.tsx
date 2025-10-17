import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateShort } from '../utils/formatDate';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await dashboardService.getDashboard();
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Center h="60vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </Layout>
    );
  }

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>Dashboard</Heading>
          <Text color="gray.600">Overview of your finances</Text>
        </Box>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">Total Income</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {formatCurrency(data?.summary.total_income || 0)}
              </StatNumber>
              <StatHelpText>{data?.summary.total_transactions || 0} transactions</StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">Total Expense</StatLabel>
              <StatNumber fontSize="2xl" color="red.500">
                {formatCurrency(data?.summary.total_expense || 0)}
              </StatNumber>
            </Stat>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">Balance</StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {formatCurrency(data?.summary.balance || 0)}
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Recent Transactions */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>Recent Transactions</Heading>
          <VStack spacing={3} align="stretch">
            {data?.recent_transactions.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                No transactions yet
              </Text>
            ) : (
              data?.recent_transactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  p={4}
                  bg="gray.50"
                  rounded="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Box
                        w="40px"
                        h="40px"
                        bg={transaction.category_color || 'gray.300'}
                        rounded="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xl"
                      >
                        {transaction.category_icon || '📝'}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold">
                          {transaction.category_name || 'Uncategorized'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {transaction.description || 'No description'}
                        </Text>
                      </Box>
                    </HStack>
                    <VStack align="end" spacing={0}>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color={transaction.type === 'income' ? 'green.500' : 'red.500'}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatDateShort(transaction.transaction_date)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </Box>

        {/* Top Categories */}
        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>Top Spending Categories</Heading>
          <VStack spacing={3} align="stretch">
            {data?.category_breakdown.slice(0, 5).map((category) => (
              <HStack key={category.id} justify="space-between">
                <HStack>
                  <Box
                    w="32px"
                    h="32px"
                    bg={category.color}
                    rounded="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {category.icon}
                  </Box>
                  <Text>{category.name}</Text>
                  <Badge colorScheme={category.type === 'income' ? 'green' : 'red'}>
                    {category.type}
                  </Badge>
                </HStack>
                <Text fontWeight="bold">{formatCurrency(category.total_amount)}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Layout>
  );
}