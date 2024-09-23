import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TransactionUpdateDelete from "~/components/TransactionUpAndDelForm";

export default function TransactionPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className='bg-background h-full p-4'>
      <Text className='text-white text-base text-left text-gray-600 mb-4'>
        Here you can update or delete the transaction the selected transaction.
      </Text>
      <TransactionUpdateDelete id={id} />
    </View>
  );
}
