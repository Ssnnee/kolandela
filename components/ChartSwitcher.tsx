import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, } from 'react-native';
import TabButton, { TabButtonType } from './TabButton';
import {
  LineChart,
  BarChart,
} from "react-native-chart-kit";

export enum ChartType {
  BezierLine,
  Bar,
}

export default function ChartSwitcher() {
const screenWidth = Dimensions.get("window").width;
  const dataLinear = {
    labels: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
  };

  const dataBar = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };
  const [selectedTab, setSelectedTab] = useState<ChartType>(ChartType.BezierLine);
  const buttons: TabButtonType[] = [
    { title: 'Linéaire' },
    { title: 'Batôn' },
  ];

  return (
    <View className='bg-background h-1/2'>
      <TabButton
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
        <ScrollView
          horizontal
          className='py-5'
        >
          { selectedTab === ChartType.BezierLine ? (
            <LineChart
              data={dataLinear}
              width={Dimensions.get("window").width}
              height={250}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          ) : (
              <BarChart
                data={dataBar}
                width={Dimensions.get("window").width - 10}
                height={250}
                yAxisLabel='€'
                verticalLabelRotation={30}
                chartConfig={chartConfig}
              />
            )}
        </ScrollView>

      </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#0E0E12",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#0E0E12",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

