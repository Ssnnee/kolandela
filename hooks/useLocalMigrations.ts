import { db, sqliteDB } from '@/db/initialize-drizzle';
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export function useLocalMigrations(){
  const migrationsData =  useMigrations(db, migrations);

  if (__DEV__){
    useDrizzleStudio(sqliteDB);
  }

  return migrationsData;
}
