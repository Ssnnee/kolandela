import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TransactionForm from "~/components/TransactionForm";
import PlannedTransactionForm from "~/components/PlannedTransactionForm";

export default function CreationPage() {
  const { name } = useLocalSearchParams();

  return (
    <View className='bg-background h-full p-4'>
      <Text className='text-white text-base text-left text-gray-600 mb-4'>
        {name === 'transaction'
          ? 'Please fill out the form below to create a new transaction. Make sure to enter all necessary details like amount, category, and date.'
          : 'Plan your future transactions here by entering the amount, date, and other relevant details.'}
      </Text>
      { name === 'transaction' ? <TransactionForm /> : <PlannedTransactionForm /> }
    </View>
  );
}
