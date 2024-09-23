import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PlannedTransactionUpdateDelete from "~/components/PlannedTransactionUpAndDelForm";

export default function TransactionPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className='bg-background h-full p-4'>
      <Text className='text-white text-base text-left text-gray-600 mb-4'>
        Transaction ID: {id}
      </Text>
      <PlannedTransactionUpdateDelete id={id} />
    </View>
  );
}
