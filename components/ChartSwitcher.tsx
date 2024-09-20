import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, Text } from 'react-native';
import TabButton, { TabButtonType } from './TabButton';
import { LineChart, BarChart } from "react-native-chart-kit";
import { fetchTransactions } from '~/api/transactions';
import { Transaction } from '~/types';

export enum ChartType {
  Line,
  Bar,
}

export default function ChartSwitcher() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTab, setSelectedTab] = useState<ChartType>(ChartType.Line);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transactions. Please try again later.');
      }
    };

    loadTransactions();
  }, []);

  const processTransactions = () => {
    const monthlyTotals: { [key: string]: number } = {};
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;

      if (transaction.type === 'EXPENSE') {
        monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) - transaction.amount;
      } else {
        monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + transaction.amount;
      }
    });

    const sortedEntries = Object.entries(monthlyTotals).sort((a, b) => {
      const [monthYearA] = a;
      const [monthYearB] = b;
      return new Date(monthYearA).getTime() - new Date(monthYearB).getTime();
    });

    const labels = sortedEntries.slice(-6).map(([label]) => label);
    const data = sortedEntries.slice(-6).map(([, value]) => value);

    return { labels, data };
  };

  const { labels, data } = processTransactions();

  const chartData = {
    labels,
    datasets: [
      {
        data: data.length > 0 ? data : [0],
        color: (opacity = 1) => `rgba(173, 123, 255, ${opacity})`, // violate color
        strokeWidth: 2
      }
    ],
  };

  const buttons: TabButtonType[] = [
    { title: 'Line' },
    { title: 'Bar' },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#0E0E12",
    backgroundGradientTo: "#0E0E12",
    color: (opacity = 1) => `rgba(173, 123, 255, ${opacity})`, // violate color
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fill: "#A2A2B5", // gray-light color for labels
    },
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0E0E12' }}>
        <Text style={{ color: '#FF3B30' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#0E0E12', height: 400 }}>
      <TabButton
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <ScrollView
        horizontal
        style={{ paddingVertical: 20 }}
      >
        {selectedTab === ChartType.Line ? (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={280}
            chartConfig={chartConfig}
            bezier
            style={{ marginHorizontal: -15 }}
          />
        ) : (
          <BarChart
            data={chartData}
            width={Dimensions.get("window").width}
            height={280}
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={{ marginHorizontal: -15 }}
          />
        )}
      </ScrollView>
    </View>
  );
}
