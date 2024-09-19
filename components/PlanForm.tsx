import { Text, View, TextInput, Button } from "react-native";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

export const transactionSchema = z.object({
  user_id: z.number(),
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


export default function ExpenseForm() {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      user_id: 1,
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
