import { format } from "date-fns";
import { Text, TouchableOpacity } from "react-native";

type YearCardProps = {
  date: Date;
}

export default function YearCard({ date }: YearCardProps) {
  return (
    <>
        <TouchableOpacity
          className='bg-[#4E4E61] rounded-3xl p-5 border-2 border-foreground'>
            <Text className='text-white'>
              { format(new Date(date), 'yyyy') as string }
            </Text>
        </TouchableOpacity>
    </>
  );
}
