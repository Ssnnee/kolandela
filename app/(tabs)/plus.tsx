import { Stack } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';
import BottomSheet from '~/components/BottomSheet';
import { ButtonCard } from '~/components/ButtonCard';
import Header from '~/components/Header';

export default function Home() {
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
        <BottomSheet bottomSheetRef={bottomSheetRef}>
        <View className='h-full gap-5 justify-center items-center'>
          <ButtonCard title='Ajouter une entrée' />
          <ButtonCard title='Ajouter une dépenses ' />
          <ButtonCard title='Plannifier une dépenses' />
          <ButtonCard title='Ajouter une catégorie' />
        </View>
        </BottomSheet>

      </>
  );
}
