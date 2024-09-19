import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BottomSheet from "./BottomSheet";
import { useRef } from "react";
import { CustomDropdown } from "./CustomDropdown";
import Button from "./Button";
import { Stack } from "expo-router";

export const transactionSchema = z.object({
  description: z.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  date: z.date(),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  category: z.string()
    .min(3, { message: "Category must be at least 3 characters long" })
    .max(50, { message: "Category must be at most 50 characters long" }),
  type: z.enum(["INCOME", "EXPENSE"]),
  paymentMethod: z.enum(["CASH", "CARD"]).optional(),
});

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

export default function TransactionForm() {
  const bottomSheetRef = useRef();
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      date: new Date(),
      amount: 0,
      category: "",
      type: "EXPENSE",
      paymentMethod: "CASH",
    },
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    console.log(values);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: '#0E0E12', // This is your 'background' color
          },
          headerTintColor: '#ffffff', // This will change the color of the header text and back button
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'New Transaction', // This will set the title of the header
        }}
      />
      <View className='bg-background h-full'>
        <View className='w-full p-5 gap-2'>
          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Description'
                  placeholderTextColor="#666680"
                />
              </>
            )}
            name='description'
          />
          {form.formState.errors.description && (
            <Text className='text-red'>{form.formState.errors.description.message}</Text>
          )}

          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
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
              </>
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
            render={({ field: { onChange } }) => (
              <TouchableOpacity
                className="bg-background-variant rounded-lg border-2 border-foreground p-3"
              onPress={() => bottomSheetRef.current?.open()}
            >
                <Text className='text-white mb-1'>Date</Text>
                <BottomSheet  bottomSheetRef={bottomSheetRef}>
                  <Calendar
                  onDayPress={(day) => {
                    onChange(new Date(day.dateString));
                    bottomSheetRef.current?.close();
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
            title="Submit"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </>
  );
}

