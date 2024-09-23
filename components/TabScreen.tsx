import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TabButton, { TabButtonType } from './TabButton';
import ExpenseCard from './ExpenseCard';
import PlannedExpenseCard from './PlannedExpenseCard';
import { fetchTransactions, fetchPlannedTransactions, updatePlannedTransaction } from '~/api/transactions';
import { Transaction, PlannedTransaction } from '~/types';  // Make sure the path is correct

export enum Tab {
  Expense,
  Planning,
}

export default function TabScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Expense);
  const queryClient = useQueryClient();

  const buttons: TabButtonType[] = [
    { title: 'Transactions' },
    { title: 'Plan' },
  ];

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { data: plannedTransactions = [] } = useQuery<PlannedTransaction[]>({
    queryKey: ['plannedTransactions'],
    queryFn: fetchPlannedTransactions,
  });

  const updatePlannedTransactionMutation = useMutation({
    mutationFn: ({ id, isExecuted }: { id: string; isExecuted: boolean }) =>
      updatePlannedTransaction(id, { isExecuted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedTransactions'] });
    },
  });

  const handlePlannedTransactionCheckboxChange = (id: string, value: boolean) => {
    updatePlannedTransactionMutation.mutate({ id, isExecuted: value });
  };

  return (
    <View className='bg-background h-full'>
      <TabButton
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <ScrollView>
        {selectedTab === Tab.Expense ? (
          <View className='items-center m-5 gap-4'>
            {transactions.map(transaction => (
              <ExpenseCard
                key={transaction.id}
                id={transaction.id}
                description={transaction.description}
                date={new Date(transaction.date)}
                amount={transaction.amount}
                type={transaction.type}
              />
            ))}
          </View>
        ) : (
          <View className='items-center m-5 gap-4'>
            {plannedTransactions.map(transaction => (
              <PlannedExpenseCard
                key={transaction.id}
                id={transaction.id}
                description={transaction.description}
                date={new Date(transaction.date)}
                amount={transaction.amount}
                isExecuted={transaction.isExecuted}
                onCheckboxChange={handlePlannedTransactionCheckboxChange}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
