import { Text, TouchableOpacity, View } from "react-native";

type CatogoryCardProps = {
  title: string;
  total: number;
  percentage: number;
  color: string;
}

export default function CategoryCard({ title, total, percentage, color }: CatogoryCardProps) {
  return (
    <>
        <TouchableOpacity
          className='w-full bg-background-variant gap-5 items-center my-5 p-5 rounded-3xl border-2 border-foreground'>
          <View className='flex-row items-center justify-between w-full'>
            <Text className='text-white font-bold text-xl'> { title } </Text>
            <Text className='text-white text-sm font-bold'> { total }  </Text>
          </View>
          <View className='w-full h-1 bg-foreground rounded-full'>
            <View className={ `h-full bg-[${color}] w-[${percentage +'%'}] rounded-full` }></View>
          </View>
        </TouchableOpacity>
    </>
  );
}
