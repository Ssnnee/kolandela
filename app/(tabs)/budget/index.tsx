import { Stack } from 'expo-router';
import { useRef } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import { ButtonCard } from '~/components/ButtonCard';
import Header from '~/components/Header';
import {
  ProgressChart,
} from "react-native-chart-kit";
import CategoryCard from '~/components/CategoryCard';

export default function CategoryPage() {
  const income = 100000;
  const expenses = 100;
  const percentage = (expenses / income) * 100;

  const data = {
    labels: ["Transport", "Divertissement", "Securité"], // optional
    data: [0.4, 0.6, 0.8],
    colors: [
      "red",
      "green",
      "#AD7BFF",
      "rgba(60, 179, 113,0.2)",
      "rgba(255, 172, 71 , 0.3)",
    ],
  };
  const bottomSheetRef = useRef();
  return (
    <>
      <Stack.Screen  options={{ title: '', header() {
        return (
          <Header
            title="Écran d'ajout"
            bgColor='background'
            textColor='foreground'
            onPress={() => bottomSheetRef.current.open()}
          />
        );
      },}}
    />
        <View className='flex-1 bg-background p-5 items-center'>
          <ProgressChart
          data={data}
          width={Dimensions.get("window").width - 10}
          height={170}
          strokeWidth={8}
          hideLegend={true}
          withCustomBarColorFromData={true}
          radius={35}
          chartConfig={{
            useShadowColorFromDataset: false,
            backgroundGradientFrom: "#0E0E12",
            backgroundGradientTo: "#0E0E11",
            color: (opacity = 1) => `rgba(255, 121, 102, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
        <View className='w-full bg-background items-center p-5 rounded-3xl border-2 border-foreground'>
            <Text className='text-white'>
              { (percentage > 90) ?
                'Vous êtes en danger' :
                (percentage > 50) ?
                'Vous dépensez beaucoup' :
                'Vous êtes dans la moyenne'
              }
            </Text>
        </View>
          <ScrollView>
          <CategoryCard
            title='Transport'
            total={10088}
            percentage={40}
            color='#FF7966'
          />
          <CategoryCard
            title='Divertissement'
            total={79898}
            percentage={80}
            color='#00FAD9'
          />
          <CategoryCard
            title='Securité'
            total={79898}
            percentage={60}
            color='#AD7BFF'
          />
          </ScrollView>
        <BottomSheet bottomSheetRef={bottomSheetRef}>
          <View className='h-full gap-5 justify-center items-center'>
            <Text className='text-white'>Remplissez les champs suivants</Text>
            <ButtonCard title='Ajouter une catégorie' />
          </View>
        </BottomSheet>
        </View>
      </>
  );
}

