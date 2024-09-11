import { useState } from 'react';
import { View, Text } from 'react-native';
import TabButton, { TabButtonType } from './TabButton';

export enum Tab {
  Expense,
  Planning,
}

export default function TabScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Expense);
  const buttons: TabButtonType[] = [
    { title: 'Expense' },
    { title: 'Planning' },
  ];
  return (
    <>
      <TabButton
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      />
      <View className='flex-1 justify-center items-center'>
        { selectedTab === Tab.Expense ? (
          <Text className='text-lg font-bold'>Expense</Text>
        ) : (
          <Text className='text-lg font-bold'>Planning</Text>
        )}
      </View>
    </>
  );
}
