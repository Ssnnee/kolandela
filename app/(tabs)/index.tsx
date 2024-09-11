import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import TabScreen from '~/components/TabScreen';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const chartConfig = {
  useShadowColorFromDataset: false,
  backgroundGradientFrom: "#0E0E12",
  backgroundGradientTo: "#0E0E11",
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

  const [isScrolling, setIsScrolling] = React.useState(false);

  return (
    <>
      <ScrollView
      >
        <View className='bg-background pb-8 items-center'>

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

          <View className='flex-row items-center justify-center gap-4 '>

            <View className={mStyles}>
              <Text className='text-grey-40 font-bold text-center '>
              Revenus
            </Text>
              <Text className={tStyles}>100 000</Text>
            </View>

            <View className={mStyles}>
              <Text className='text-grey-40 font-bold text-center '>
              Dépenses
            </Text>
              <Text className={tStyles}>100</Text>
            </View>

            <View className={mStyles}>
              <Text className='text-grey-40 font-bold text-center '>
              Économies
            </Text>
              <Text className={tStyles}> 1 978 998 900</Text>
            </View>

          </View>
        </View>

        <TabScreen />
      </ScrollView>
    </>
  );
}

const mStyles = 'bg-[#4E4E61] rounded-3xl p-5 border-2 border-foreground'
const tStyles = 'text-white text-center text-sm'
