import { Link } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import welcomeBackground from '~/assets/welcome.png';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useEffect, useState } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { transaction } from '~/db/schema';
import migrations from '~/drizzle/migrations';

const expo = SQLite.openDatabaseSync('kolandela.db');

const db = drizzle(expo);



export default function Home() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof transaction.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) console.error(error);
    (async () => {
      const items = await db.select().from(transaction).execute();
      setItems(items);
      console.log("From app/index.tsx :", items);
    })();

  } , [success]);
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
              Track, plan, and analyze your finances {"\n"} for simplified management
              of your {"\n"} expenses and income.
            </Text>
            <Link
              href='/(tabs)'
              asChild
            >
              <TouchableOpacity
                className='bg-orange h-14 px-28 flex justify-center rounded-full'
              >
                  <Text className='text-white'> Get Started </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}
