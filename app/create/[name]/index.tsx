import { Text, View, TextInput, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import TransactionForm from "~/components/TransactionForm";

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
      <TransactionForm  />
      </View>
  );
}
