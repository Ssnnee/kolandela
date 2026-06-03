import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/db';
import migrations from '@/drizzle/migrations';
import { useEffect } from 'react';
import { seedDatabase } from '@/db/seed';
import ThemeProvider, { useTheme } from './_context/ThemeContext';
import CurrencyProvider from './_context/CurrencyContext';
import { LanguageProvider } from './_context/LanguageContext';
import BottomSheetProvider from './_context/BottomSheetContext';
import { View, Text, ActivityIndicator } from 'react-native';

function MigrationWrapper({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    if (success) seedDatabase();
  }, [success]);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)' }}>
        <Text style={{ color: 'rgb(255,59,48)', fontSize: 14 }}>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)' }}>
        <ActivityIndicator color="rgb(255,121,102)" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <CurrencyProvider>
        <BottomSheetProvider>
          <MigrationWrapper>
            <RootNavigator />
          </MigrationWrapper>
      </BottomSheetProvider>
      </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)',
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="transactions/index" options={{ headerShown: false }} />
        <Stack.Screen name="planned-transactions/index" options={{ headerShown: false }} />
        <Stack.Screen name="transactions/add" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="planned-transactions/add" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
