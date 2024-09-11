import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import TabScreen from '~/components/TabScreen';

export default function Home() {
  return (
    <>
        <SafeAreaView className='h-full'>
          <TabScreen />
        </SafeAreaView>
    </>
  );
}

