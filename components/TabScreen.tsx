import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import TabButton, { TabButtonType } from './TabButton';
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetters } from '~/lib/utils';

export enum Tab {
  Expense,
  Planning,
}

export default function TabScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Expense);
  const buttons: TabButtonType[] = [
    { title: 'Dépenses' },
    { title: 'Planifications' },
  ];
  return (
    <View className='bg-background h-full'>
      <TabButton
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
        <ScrollView>
          { selectedTab === Tab.Expense ? (
            <>
              <View className='h-20 m-4 rounded-xl border-foreground border-2'>
                <View className='space-y-5 justify-start p-3'>
                  <Text className='text-white font-bold'>Expense</Text>
                  <Text
                    className='text-white font-bold'>
                    { capitalizeFirstLetters(format(new Date(), 'EEE, dd  MMM yyy, HH:mm ', { locale: fr })).replace(/\./g, '') }
                  </Text>
                </View>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              <View className='h-14 m-4 rounded-xl border-foreground border-2'>
                <Text className='text-white font-bold'>Expense</Text>
              </View>
              </>
          ) : (
              <Text className='text-lg font-bold'>Planning</Text>
            )}
        </ScrollView>

      </View>
  );
}
