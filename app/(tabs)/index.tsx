import { Image, StyleSheet, Platform, Text, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db/initialize-drizzle';
import { transaction } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';


export default function HomeScreen() {
  // const { data } = useLiveQuery(db.select().from(transaction));
  const { data } = useLiveQuery(
  db.select({
    totalIncome: sql<number>`cast(sum(${transaction.amount}) as float)`
  })
  .from(transaction)
  .where(eq(transaction.type, 'EXPENSE'))
);


  return (
    <SafeAreaView>
      <ThemedText> Home Screen { JSON.stringify(data)} </ThemedText>

    </SafeAreaView>
  );
}
