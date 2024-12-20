import { Image, StyleSheet, Platform, Text, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db/initialize-drizzle';
import { transaction } from '@/db/schema';


export default function HomeScreen() {
  const { data } = useLiveQuery(db.select().from(transaction));
  return (
    <SafeAreaView>
      <ThemedText> Home Screen </ThemedText>
      {data.map((item) => (
        <ThemedView key={item.id}>
          <ThemedText>This is a description {item.description}</ThemedText>
          <ThemedText>{item.amount}</ThemedText>
        </ThemedView>
      ))}
    </SafeAreaView>
  );
}

