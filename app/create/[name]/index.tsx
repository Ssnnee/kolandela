import { Text, View, TextInput, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";

const schema = z.object({
  name: z.string()
  .min(3, { message: "Name must be at least 3 characters long" })
  .max(50, { message: "Name must be at most 50 characters long" }),
  description: z.string().max(500, { message: "Description must be at most 500 characters long" }),
});


export default function CreationPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" }
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  const { name } = useLocalSearchParams();
  return (
    <View className='bg-background h-full'>
      <Text className='text-white'>Creating  { name } </Text>
      <View className='w-full p-5'>
        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className='w-full p-3 bg-background-variant border-2 border-foreground rounded-lg text-white'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder='Name'
            />
          )}
          name='name'
        />
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
        {form.formState.errors.name && (
          <Text className='text-orange'>{form.formState.errors.name.message}</Text>
        )}
        {form.formState.errors.description && (
          <Text className='text-red-500'>{form.formState.errors.description.message}</Text>
        )}
        <Button
          title='Create'
          onPress={form.handleSubmit(onSubmit)}
        />
      </View>
      </View>
  );
}
