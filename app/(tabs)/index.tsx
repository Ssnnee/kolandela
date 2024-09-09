import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <>
      <View className='bg-background w-full h-full'>
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
