import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '~/components/Button';
import { ButtonCard } from '~/components/ButtonCard';

export default function Home() {
  return (
    <>
      <Stack.Screen  options={{ title: '', header(props) {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, backgroundColor: '#f2f2f2' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Plus</Text>
          </View>
        );
      },}} />
      <View className='bg-background flex-1 p-6 gap-5 justify-center items-center'>
        <ButtonCard title='Ajouter une entrée' />
        <ButtonCard title='Ajouter une dépenses ' />
        <ButtonCard title='Plannifier une dépenses' />
        <ButtonCard title='Ajouter une catégorie' />
      </View>
    </>
  );
}
