import { Text, Image, View, TouchableOpacity } from 'react-native';

type HeaderProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
  onPress?: () => void;
};

export default function  Header(
  { bgColor, textColor,  title, onPress }: HeaderProps
) {

  return (
    <View
      className={`
        w-full bg-${bgColor ? bgColor: 'green'}
        flex-row items-center justify-between pt-14 px-6 p-5
      `}>
      <View>
        <TouchableOpacity
          className='h-8 w-8 items-center justify-center rounded-full text-white  bg-transparent border-2 border-foreground '
          onPress={onPress}
        >
          <Text className='text-foreground font-bold'>+</Text>
        </TouchableOpacity>
      </View>
      <Text className={`text-${textColor} text-xl font-bold`}>{title && title}</Text>
        <TouchableOpacity className=''>
            <Image source={require('~/assets/icons/settings.png')} className='h-8 w-8' />
        </TouchableOpacity>
    </View>
  );
}
