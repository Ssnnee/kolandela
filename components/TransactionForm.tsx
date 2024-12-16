import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useForm, Controller } from "react-hook-form";
import BottomSheet from "./BottomSheet";
import { useEffect, useRef, useState } from "react";
import { CustomDropdown } from "./CustomDropdown";
import Button from "./Button";
import { Stack } from "expo-router";
import { Transaction } from "~/types";
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { transaction, plannedTransaction } from "~/db/schema";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from "~/drizzle/migrations";

const categories = [
  { label: "Food", value: "FOOD" },
  { label: "Rent", value: "RENT" },
  { label: "Salary", value: "SALARY" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Utilities", value: "UTILITIES" },
  { label: "Other", value: "OTHER" },
];

const paymentMethods = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
];

const types = [
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
];

const expo = SQLite.openDatabaseSync('Kolandela.db');
const db = drizzle(expo);

export default function TransactionForm() {
  const bottomSheetRef = useRef();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof transaction.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) console.error(error);
    (async () => {
      const items = await db.select().from(transaction).execute();
      setItems(items);
      console.log("From for", items);
    })();

  } , [success]);
  const form = useForm<Transaction>({
    defaultValues: {
      description: "",
      amount: '0',
      category: "",
      type: "EXPENSE",
      paymentMethod: "CASH",
    },
  });

  async function onSubmit(values: Transaction) {
    if (!success) {
      console.error(error);
    } else {
    await db.insert(transaction).values([{
      paymentMethod: values.paymentMethod,
      type: values.type,
      amount: values.amount,
      category: values.category,
      description: values.description,
      createdAt: values.createAt,
    }]).execute();
      console.log(values);
    }
  }

  return (
    <>
      <Stack.Screen
      options={{
        headerStyle: {
          backgroundColor: '#0E0E12',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        title: 'New Transaction',
      }}
    />
        <View className='bg-background h-full'>
          <View className='w-full gap-2'>
            <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                className='w-full p-3 bg-background-variant rounded-lg text-white'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder='Description'
                placeholderTextColor="#666680"
                maxLength={20}
              />
                  <Text className='text-foreground text-xs text-right mt-1'>
                    {value.length}/20
                </Text>
                </View>
            )}
            name='description'
          />
            {form.formState.errors.description && (
              <Text className='text-red'>{form.formState.errors.description.message}</Text>
            )}

            <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='w-full p-3 bg-background-variant rounded-lg text-white'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ''}
                keyboardType="numeric"
                placeholder='Amount'
                placeholderTextColor="#666680"
              />
            )}
            name='amount'
          />
            {form.formState.errors.amount && (
              <Text className='text-red'>{form.formState.errors.amount.message}</Text>
            )}

            <Controller
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Category"
                data={categories}
                value={value}
                onChange={onChange}
                error={form.formState.errors.category?.message}
              />
            )}
            name='category'
          />

            <Controller
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Type"
                data={types}
                value={value}
                onChange={onChange}
                error={form.formState.errors.type?.message}
              />
            )}
            name='type'
          />

            <Controller
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Payment Method"
                data={paymentMethods}
                value={value ?? "CASH"}
                onChange={onChange}
                error={form.formState.errors.paymentMethod?.message}
              />
            )}
            name='paymentMethod'
          />

            <Controller
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                className="bg-background-variant rounded-lg p-3"
                onPress={() => bottomSheetRef.current?.open()}
              >
                  <Text className='text-white mb-1'>
                    {value ? value
                      : 'Select Date'}
                  </Text>
                  <BottomSheet bottomSheetRef={bottomSheetRef}>
                    <Calendar
                    current={selectedDate.toISOString().split('T')[0]}
                    onDayPress={(day) => {
                      const newDate = new Date(day.dateString);
                      setSelectedDate(newDate);
                      onChange(newDate);
                      bottomSheetRef.current?.close();
                    }}
                    markedDates={{
                      [selectedDate.toISOString().split('T')[0]]: {selected: true, selectedColor: '#FF7966'}
                    }}
                    style={{
                      borderRadius: 8,
                    }}
                    theme={{
                      backgroundColor: '#0E0E12',
                      calendarBackground: '#26262F',
                      textSectionTitleColor: '#A2A2B5',
                      selectedDayBackgroundColor: '#FF7966',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#00FAD9',
                      dayTextColor: '#666680',
                      textDisabledColor: '#353542',
                      monthTextColor: '#ffffff',
                      arrowColor: '#FF7966',
                      dotColor: '#AD7BFF',
                      todayBackgroundColor: 'transparent',
                    }}
                  />
                  </BottomSheet>
                </TouchableOpacity>
            )}
            name='createAt'
          />
            {form.formState.errors.createAt && (
              <Text className='text-red'>{form.formState.errors.createAt.message}</Text>
            )}

            <Button
            title="Submit"
            onPress={form.handleSubmit(onSubmit)}
            className="mt-4"
          />
          </View>
        </View>
      </>
  );
}
