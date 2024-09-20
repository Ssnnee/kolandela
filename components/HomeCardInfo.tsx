import { Text, TouchableOpacity, View } from "react-native";

type HomeCardInfoProps = {
  title: string;
  total: number;
}

export default function HomeCardInfo({ title, total }: HomeCardInfoProps) {
  return (
    <>
        <TouchableOpacity
          className='bg-background-variant rounded-3xl p-5'>
              <Text className='text-grey-40 font-bold text-center '>
                {title}
            </Text>
              <Text className='text-white text-center text-sm'> { total }</Text>
        </TouchableOpacity>
    </>
  );
}
