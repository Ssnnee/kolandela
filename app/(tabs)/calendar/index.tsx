import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <View className='bg-background h-full'>
        <Text> Message from Calendar </Text>
      </View>
    </>
  );
}
