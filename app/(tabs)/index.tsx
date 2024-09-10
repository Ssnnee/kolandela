import React from 'react';
import { View, Text } from 'react-native';
import { Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  useShadowColorFromDataset: false,
  backgroundGradientFrom: "#1C1C23",
  backgroundGradientTo: "#1C1C23",
  color: (opacity = 1) => `rgba(255, 121, 102, ${opacity})`,
};

export default function Home() {
  const income = 100000;
  const expenses = 100;
  const percentage = (expenses / income) * 100;

  const data = {
    labels: ["Expenses"],
    data: [(percentage / 100)],
  };

  return (
    <View className='bg-background w-full h-full items-center'>
      <ProgressChart
      data={data}
      width={screenWidth}
      height={200}
      strokeWidth={8}
      radius={80}
      chartConfig={chartConfig}
      hideLegend={true}
      style={{
      }}
    />
      <View className='flex items-center justify-center top-20 absolute'>
        <Text className='text-white text-xl'>Dépenses</Text>
        <Text className='text-white text-xl'>{percentage}%</Text>
      </View>

      <View className='flex-row items-center justify-center '>

        <View className='bg-white  rounded-3xl '>
          <Text className='text-black text-center '>Revenus</Text>
          <Text className='text-black text-center '>100 000</Text>
        </View>

        <View className='bg-white  rounded-3xl '>
          <Text className='text-black text-2xl text-center'>Dépenses</Text>
          <Text className='text-black text-2xl text-center'>100</Text>
        </View>

        <View className='bg-white  rounded-3xl '>
          <Text className='text-black text-2xl text-center'>Économies</Text>
          <Text className='text-black text-2xl text-center'>99 900</Text>
        </View>

      </View>


    </View>
  );
}

