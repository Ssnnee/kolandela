import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import BottomSheet from '~/components/BottomSheet';
import { ButtonCard, LinkType } from '~/components/ButtonCard';
import Header from '~/components/Header';
import TabScreen from '~/components/TabScreen';
import HomeCardInfo from '~/components/HomeCardInfo';
import { fetchTransactions } from '~/api/transactions';
import { Transaction } from '~/types';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  useShadowColorFromDataset: false,
  backgroundGradientFrom: "#0E0E12",
  backgroundGradientTo: "#0E0E11",
  color: (opacity = 1) => `rgba(255, 121, 102, ${opacity})`,
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const transactionsData: Transaction[] = await fetchTransactions();
      setTransactions(transactionsData);

      // Calculate income, expenses, and savings
      const totalIncome = transactionsData
        .filter(transaction => transaction.type === 'INCOME')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const totalExpenses = transactionsData
        .filter(transaction => transaction.type === 'EXPENSE')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const totalSavings = totalIncome - totalExpenses;

      setIncome(totalIncome);
      setExpenses(totalExpenses);
      setSavings(totalSavings);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const percentage = income > 0 ? (expenses / income) * 100 : 0;

  const data = {
    labels: ["Expenses"],
    data: [(percentage / 100)],
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const bottomSheetRef = React.useRef();

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
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => bottomSheetRef.current.open()}
              className='h-8 w-8 right-5 items-center justify-center rounded-full bg-transparent border-2 border-foreground '
            >
              <Text className='text-foreground font-bold'>+</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView>
        <View className="bg-background pb-8 items-center">
          {/* Chart */}
          <ProgressChart
            data={data}
            width={screenWidth}
            height={200}
            strokeWidth={8}
            radius={80}
            chartConfig={chartConfig}
            hideLegend={true}
            style={{}}
          />
          <View className="flex items-center justify-center top-20 absolute">
            <Text className="text-white text-xl">Expenses</Text>
            <Text className="text-white text-xl">{percentage.toFixed(2)}%</Text>
          </View>

          <View className="flex-row items-center justify-center gap-4 ">
            <HomeCardInfo title="Incomes" total={income} />
            <HomeCardInfo title="Expenses" total={expenses} />
            <HomeCardInfo title="Savings" total={savings} />
          </View>
        </View>

        <TabScreen />

      </ScrollView>

      <BottomSheet height={200} bottomSheetRef={bottomSheetRef}>
        <View className="w-full h-full gap-5 justify-center items-center">
          <ButtonCard
            title="Add a transaction"
            onPress={() => bottomSheetRef.current?.close()}
            href={LinkType.transaction}
          />
          <ButtonCard
            title="Plan a transaction"
            onPress={() => bottomSheetRef.current?.close()}
            href={LinkType.plannedtransaction}
          />
        </View>
      </BottomSheet>
    </>
  );
}

