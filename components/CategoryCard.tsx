import { Text, TouchableOpacity, View } from "react-native";

type CategoryCardProps = {
  title: string;
  total: number;
  percentage: number;
  color: string;
}

export default function CategoryCard({ title, total, percentage, color }: CategoryCardProps) {
  return (
    <TouchableOpacity
      className='w-full bg-background-variant gap-5 items-center my-2 p-5 rounded-3xl'
    >
      <View className='flex-row items-center justify-between w-full'>
        <Text className='text-white font-bold text-xl'>{title}</Text>
        <View className='flex-row items-center'>
          <Text className='text-white text-sm font-bold mr-2'>{total}</Text>
          <Text style={{ color }} className='text-sm font-bold'>
            ({percentage.toFixed(1)}%)
          </Text>
        </View>
      </View>
      <View className='w-full h-1 bg-foreground rounded-full'>
        <View
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: '100%',
            borderRadius: 100,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
