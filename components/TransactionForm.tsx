import { Text, View, TextInput, Button } from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { date, z } from "zod";
import BottomSheet from "./BottomSheet";
import { useRef } from "react";

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
    }
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    console.log(values);
  }

  return (
    <View className='bg-background h-full'>
      <View className='w-full p-5'>
        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder='Description'
          />
        )}
        name='description'
      />
        {form.formState.errors.description && (
          <Text className='text-red-500'>{form.formState.errors.description.message}</Text>
        )}

        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
            onBlur={onBlur}
            onChangeText={(text) => {
              const parsedValue = parseFloat(text);
              onChange(isNaN(parsedValue) ? 0 : parsedValue);
            }}
            value={value ? String(value) : ''}
            keyboardType="numeric"
            placeholder='Prix'
          />
        )}
        name='amount'
      />
        {form.formState.errors.amount && (
          <Text className='text-orange'>{form.formState.errors.amount.message}</Text>
        )}

        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Dropdown
            search
            labelField='label'
            onBlur={onBlur}
            valueField='value'
            data={categories}
            value={value}
            onChange={onChange}
          />
        )}
        name='category'
      />
        {form.formState.errors.category && (
          <Text className='text-orange'>{form.formState.errors.category.message}</Text>
        )}

        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Dropdown
            search
            labelField='label'
            onBlur={onBlur}
            valueField='value'
            data={types}
            value={value}
            onChange={onChange}
          />
        )}
        name='type'
      />
        {form.formState.errors.type && (
          <Text className='text-orange'>{form.formState.errors.type.message}</Text>
        )}

        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Dropdown
            search
            labelField='label'
            onBlur={onBlur}
            valueField='value'
            data={paymentMethods}
            value={value}
            onChange={onChange}
          />
        )}
        name='paymentMethod'
      />
        {form.formState.errors.paymentMethod && (
          <Text className='text-orange'>{form.formState.errors.paymentMethod.message}</Text>
        )}
        <Controller
        control={form.control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Button title='Select Date' onPress={() => bottomSheetRef.current.open()} />
          <BottomSheet height={800} bottomSheetRef={bottomSheetRef}>
              <Calendar
                onDayPress={(day) => {
                  onChange(day.dateString);
                  bottomSheetRef.current.close();
                }}
              />
          </BottomSheet>
          </View>
        )}
        name='date'
      />
        {form.formState.errors.paymentMethod && (
          <Text className='text-orange'>{form.formState.errors.paymentMethod.message}</Text>
        )}

        <Controller
        control={form.control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
            onBlur={onBlur}
            onChangeText={(text) => {
              const parsedValue = parseFloat(text);
              onChange(isNaN(parsedValue) ? 0 : parsedValue);
            }}
            value={value ? String(value) : ''}
            keyboardType="numeric"
            placeholder='Prix'
          />
        )}
        name='amount'
      />
        {form.formState.errors.amount && (
          <Text className='text-orange'>{form.formState.errors.amount.message}</Text>
        )}
        <Button
        title='Create'
        onPress={form.handleSubmit(onSubmit)}
      />
      </View>
      </View>
  );
}
