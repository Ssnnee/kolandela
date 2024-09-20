import { Stack } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import ChartSwitcher from '~/components/ChartSwitcher';
import YearCard from '~/components/YearCard';

export default function CalendarPage() {
  const years = [
    { date: new Date(2023, 0, 1), total: 5000 },
    { date: new Date(2022, 0, 1), total: -1500 },
    { date: new Date(2021, 0, 1), total: 3000 },
  ];
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
          title: 'Overview',
        }}
      />
      <ScrollView className='bg-background' >
        <View className='flex-1 p-5 items-center'>
          <Text className='text-white text-center text-xl font-bold'>
            Graphical Overview
        </Text>
          <ChartSwitcher />
          <View className='justify-between pb-5 items-center'>
            <Text className='text-white font-bold'> Passed years </Text>
          </View>
          <ScrollView>
          <View className='flex-row flex-wrap gap-2 py-5 justify-center items-center' >
            {years.map((year, index) => (
              <YearCard key={index} date={year.date} total={year.total} />
            ))}
          </View>
          </ScrollView>
        </View>
      </ScrollView >
      </>
  );
}
