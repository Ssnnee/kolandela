import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar';
import { AddActionSheet } from '../../components/AddActionSheet';
import { useBottomSheet } from '../_context/BottomSheetContext';

function TabsWithSheet() {
  const { bottomSheetRef } = useBottomSheet();

  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="categories" />
        <Tabs.Screen name="stats" />
        <Tabs.Screen name="settings" />
      </Tabs>
      <AddActionSheet ref={bottomSheetRef} />
    </>
  );
}

export default function TabsLayout() {
  return <TabsWithSheet />;
}
