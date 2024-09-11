import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, } from 'react-native';
import TabButton, { TabButtonType } from './TabButton';
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetters } from '~/lib/utils';
import Checkbox from './CheckBox';

export enum Tab {
  Expense,
  Planning,
}

export default function TabScreen() {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Expense);
  const [checked, setChecked] = useState(false);
  const buttons: TabButtonType[] = [
    { title: 'Transactions' },
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
            <View className='items-center m-5 gap-4'>
              <View className='w-full flex-row items-center justify-between p-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Freelance</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-green text-3xl font-bold'>+</Text>
                  <Text className='text-white font-bold'>2000000 </Text>
                </View>

              </View>

              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-red text-3xl font-bold'>-</Text>
                  <Text className='text-white font-bold'>78 </Text>
                </View>
              </View>

              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-red text-3xl font-bold'>-</Text>
                  <Text className='text-white font-bold'>78 </Text>
                </View>

              </View>
              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-red text-3xl font-bold'>-</Text>
                  <Text className='text-white font-bold'>78 </Text>
                </View>
              </View>
              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-red text-3xl font-bold'>-</Text>
                  <Text className='text-white font-bold'>78 </Text>
                </View>
              </View>

              </View>
          ) : (
            <View className='items-center m-5 gap-4'>
              <View className='w-full flex-row items-center justify-between p-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Freelance</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                    <Text className='text-white font-bold'>2000000 </Text>
                  <Text className='text-green text-3xl font-bold'>+</Text>
                </View>

              </View>

              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                      <Text className='text-white font-bold'>78 </Text>
                  <Text className='text-red text-3xl font-bold'>-</Text>
                </View>
              </View>

              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                      <Text className='text-white font-bold'>78 </Text>
                    <Checkbox
          checked={checked}
          onChange={setChecked}
                      buttonStyle={styles.checkboxBase}
          activeButtonStyle={styles.checkboxChecked}
        />
                </View>

              </View>
              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-white font-bold'>78 </Text>
                      <Checkbox
                      checked={checked}
                      onChange={setChecked}
                    />
                </View>
              </View>
              <View className='w-full flex-row items-center justify-between p-5 mx-5 rounded-xl border-foreground border-2'>
                <View className=''>
                  <Text className='text-white font-bold'>Restaurant</Text>
                  <Text
                    className='text-violate'>
                    {
                      capitalizeFirstLetters(
                        format(
                          new Date(), 'EEE, dd  MMM yyy, HH:mm', { locale: fr }
                        )).replace(/\./g, '')
                    }
                  </Text>
                </View>

                <View className='flex-row gap-4 items-center'>
                  <Text className='text-white font-bold'>78 </Text>
                    <Checkbox
          checked={checked}
          onChange={setChecked}
        />
                </View>
              </View>

              </View>
            )}
        </ScrollView>

      </View>
  );
}

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'coral',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: 'coral',
  },
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 18,
  },
});

