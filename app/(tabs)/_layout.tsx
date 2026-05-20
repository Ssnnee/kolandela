import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar';
import { AddActionSheet } from '../../components/AddActionSheet';
import { useBottomSheet } from '../_context/BottomSheetContext';
import { useTheme } from '../_context/ThemeContext';

function TabsWithSheet() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { bottomSheetRef } = useBottomSheet();

  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)',
          },
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
