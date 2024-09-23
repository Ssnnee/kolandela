import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useForm, Controller } from "react-hook-form";
import BottomSheet from "./BottomSheet";
import { CustomDropdown } from "./CustomDropdown";
import Button from "./Button";
import { Stack, useRouter } from "expo-router";
import { updateTransaction, deleteTransaction, getTransactionById } from "~/api/transactions";
import { Transaction } from "~/types";
import { Trash2 } from 'lucide-react-native';

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

interface TransactionUpdateDeleteProps {
  id: string | string[];
}

export default function TransactionUpdateDelete(
  { id }: TransactionUpdateDeleteProps
) {
  const router = useRouter();
  const bottomSheetRef = useRef();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const form = useForm<Transaction>();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const transaction = await getTransactionById(id);
        if (transaction) {
          form.reset(transaction);
          setSelectedDate(new Date(transaction.date));
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    };

    fetchTransaction();
  }, [id]);

  function onSubmit(values: Transaction) {
    try {
      updateTransaction(id, values);
      router.back();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  }

  function onDelete() {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            try {
              deleteTransaction(id);
              router.back();
            } catch (error) {
              console.error('Error deleting transaction:', error);
            }
          }
        }
      ]
    );
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
          title: 'Edit Transaction',
          headerRight: () => (
            <TouchableOpacity onPress={onDelete}>
              <Trash2 color="#FF7966" size={24} />
            </TouchableOpacity>
          ),
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
                  {value?.length || 0}/20
                </Text>
              </View>
            )}
            name='description'
          />
          {form.formState.errors.description && (
            <Text className='text-red-500 text-xs'>Description is required</Text>
          )}
            <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className='w-full p-3 bg-background-variant rounded-lg text-white'
                onBlur={onBlur}
                onChangeText={(text) => {
                  const parsedValue = parseFloat(text);
                  onChange(isNaN(parsedValue) ? 0 : parsedValue);
                }}
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
                    {value instanceof Date
                      ? value.toLocaleDateString()
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
            name='date'
          />
            {form.formState.errors.date && (
              <Text className='text-red'>{form.formState.errors.date.message}</Text>
            )}

          <Button
            title="Update"
            onPress={form.handleSubmit(onSubmit)}
            className="mt-4"
          />
        </View>
      </View>
    </>
  );
}
