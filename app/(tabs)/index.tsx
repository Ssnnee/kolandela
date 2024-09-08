import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View className='bg-pink'>
        <Text className='text-white'> Hellooo world! </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    backgroundColor: 'black',
  },
});
