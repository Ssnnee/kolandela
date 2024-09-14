import { Stack } from 'expo-router';
import { useRef } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import { ButtonCard } from '~/components/ButtonCard';
import Header from '~/components/Header';
import { useTheme } from '@react-navigation/native';
import CategoryCard from '~/components/CategoryCard';
import ChartSwitcher from '~/components/ChartSwitcher';
import YearCard from '~/components/YearCard';

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


// const chartConfig = {
//   useShadowColorFromDataset: false,
//   backgroundGradientFrom: "#0E0E12",
//   backgroundGradientTo: "#0E0E11",
//   color: (opacity = 1) => `rgba(255, 121, 102, ${opacity})`,
// };

export default function CalendarPage() {
  const screenWidth = Dimensions.get("window").width;
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
          <Text className='text-white text-center text-xl font-bold'>
          Représentation graphique des dépenses de l'année en cours
        </Text>
          <ChartSwitcher />
          <View className='justify-between pb-5 items-center'>
            <Text className='text-white font-bold'>Annéé précédente </Text>
          </View>
          <ScrollView>
          <View className='flex-row flex-wrap gap-2 py-5 justify-center items-center' >
            <YearCard date={ new Date(2014, 1, 11) } />
            <YearCard date={ new Date(2015, 1, 11) } />
            <YearCard date={ new Date(2016, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2017, 1, 11) } />
            <YearCard date={ new Date(2018, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
          </View>
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
