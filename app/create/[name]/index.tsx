import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import TransactionForm from "~/components/TransactionForm";
import PlannedTransactionForm from "~/components/PlannedTransactionForm";

export default function CreationPage() {

  const { name } = useLocalSearchParams();

  return (
    <View className='bg-background h-full'>
      { name === 'transaction' ? <TransactionForm /> : <PlannedTransactionForm /> }
      </View>
  );
}
