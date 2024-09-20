import { Link } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import welcomeBackground from '~/assets/welcome.png';

export default function Home() {
  return (
    <>
      <ImageBackground
        source={welcomeBackground}
        resizeMode='cover'
        className='flex-1'
      >
        <View className='h-full py-16 px-4 flex items-center justify-between '>
          <Text className='py-6 text-white text-3xl font-semibold'>
            { "Kolandela".toUpperCase() }
          </Text>
          <View className='flex items-center gap-3'>
            <Text className='text-black text-white text-lg text-center'>
              Track, plan, and analyze your finances {"\n"} for simplified management
              of your {"\n"} expenses and income.
            </Text>
            <Link
              href='/(tabs)'
              asChild
            >
              <TouchableOpacity
                className='bg-orange h-14 px-28 flex justify-center rounded-full'
              >
                  <Text className='text-white'> Get Started </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}
