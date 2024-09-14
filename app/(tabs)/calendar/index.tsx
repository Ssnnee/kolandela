import { Stack } from 'expo-router';
import { useRef } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import { ButtonCard } from '~/components/ButtonCard';
import Header from '~/components/Header';
import ChartSwitcher from '~/components/ChartSwitcher';
import YearCard from '~/components/YearCard';

export default function CalendarPage() {
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
      <ScrollView className='bg-background' >
        <View className='flex-1 p-5 items-center'>
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
            <YearCard date={ new Date(2018, 1, 11) } />
            <YearCard date={ new Date(2019, 7, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2019, 1, 11) } />
            <YearCard date={ new Date(2029, 8, 8) } />
          </View>
          </ScrollView>
          <BottomSheet bottomSheetRef={bottomSheetRef}>
            <View className='h-full gap-5 justify-center items-center'>
              <Text className='text-white'>Remplissez les champs suivants</Text>
              <ButtonCard title='Ajouter une catégorie' />
            </View>
          </BottomSheet>
        </View>
      </ScrollView >
      </>
  );
}
