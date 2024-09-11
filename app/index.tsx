import { Link } from 'expo-router';
import { ImageBackground, Pressable, Text, View } from 'react-native';
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
              Suivez, planifiez et analysez vos finances {"\n"} pour une gestion
              simplifiée de vos {"\n"} dépenses et revenus.
            </Text>
            <Link
              href='/(tabs)'
              asChild
            >
              <Pressable
                className='bg-orange h-14 px-28 flex justify-center rounded-full'
              >
                  <Text className='text-white'>Se connecter</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

