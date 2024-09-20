import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plannedTransactions, setPlannedTransactions] = useState<PlannedTransaction[]>([]);

  const buttons: TabButtonType[] = [
    { title: 'Transactions' },
    { title: 'Plan' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const transactionsData: Transaction[] = await fetchTransactions();
      const plannedTransactionsData: PlannedTransaction[] = await fetchPlannedTransactions();
      setTransactions(transactionsData);
      setPlannedTransactions(plannedTransactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handlePlannedTransactionCheckboxChange = async (id: string, value: boolean) => {
    try {
      await updatePlannedTransaction(id, { isExecuted: value });
      setPlannedTransactions(prevState =>
        prevState.map(transaction =>
          transaction.id === id ? { ...transaction, isExecuted: value } : transaction
        )
      );
    } catch (error) {
      console.error('Error updating planned transaction:', error);
    }
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

