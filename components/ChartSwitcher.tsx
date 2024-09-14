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
  const dataLinear = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
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
    { title: 'Diagramme Linéaire' },
    { title: 'Diagramme en batôn' },
  ];

  return (
    <View className='bg-background h-full'>
      <TabButton
      buttons={buttons}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
        <ScrollView>
          { selectedTab === ChartType.BezierLine ? (
            <LineChart
              data={dataLinear}
              width={Dimensions.get("window").width - 10}
              height={256}
              verticalLabelRotation={30}
              chartConfig={chartConfig}
              bezier
            />
          ) : (
              <BarChart
                data={dataBar}
                width={Dimensions.get("window").width - 10}
                height={220}
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
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

