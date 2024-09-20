import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import CategoryCard from '~/components/CategoryCard';
import { fetchTransactions } from '~/api/transactions';
import { Transaction } from '~/types';  // Make sure this path is correct

type ChartData = {
  labels: string[];
  data: number[];
  colors: string[];
};

type CategoryData = ChartData & {
  categoryCards: {
    title: string;
    total: number;
    percentage: number;
    color: string;
  }[];
};

export default function CategoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const calculateCategoryData = (): CategoryData => {
    const categoryTotals = transactions.reduce<Record<string, number>>((acc, transaction) => {
      if (transaction.type === 'EXPENSE') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {});

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const colors = ["#FF7966", "#00FAD9", "#AD7BFF"];

    return {
      labels: sortedCategories.map(([category]) => category),
      data: sortedCategories.map(([, amount]) => amount / totalExpenses),
      colors,
      categoryCards: sortedCategories.map(([category, amount], index) => ({
        title: category,
        total: amount,
        percentage: Math.round((amount / totalExpenses) * 100),
        color: colors[index],
      })),
    };
  };

  const { labels, data, colors, categoryCards } = calculateCategoryData();

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const percentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  if (loading) return <View><Text>Loading...</Text></View>;
  if (error) return <View><Text>Error: {error}</Text></View>;

  const chartData: ChartData = {
    labels,
    data,
    colors,
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: '#0E0E12',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Category',
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#0E0E12', padding: 20, alignItems: 'center' }}>
        <ProgressChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={170}
          strokeWidth={8}
          radius={35}
          chartConfig={{
            backgroundGradientFrom: "#0E0E12",
            backgroundGradientTo: "#0E0E11",
            color: (opacity = 1) => `rgba(255, 121, 102, ${opacity})`,
          }}
          hideLegend={true}
          withCustomBarColorFromData={true}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
        <View className='w-full my-2 items-center border-2 rounded-3xl border-foreground p-5'>
          <Text style={{ color: '#ffffff' }}>
            {percentage > 90
              ? 'You are spending too much'
              : percentage > 50
              ? 'You are above average'
              : 'You are doing great'}
          </Text>
        </View>
        <ScrollView>
          {categoryCards.map((card, index) => (
            <CategoryCard
              key={index}
              title={card.title}
              total={card.total}
              percentage={card.percentage}
              color={card.color}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}
