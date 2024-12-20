import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

export const sqliteDB = SQLite.openDatabaseSync('kolandela', { enableChangeListener: true });

export const db = drizzle(sqliteDB);

