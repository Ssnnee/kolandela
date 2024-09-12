import { Text, Image, View } from 'react-native';

type HeaderProps = {
  bgColor?: string;
  textColor?: string;
  title?: string;
};

export default function  Header(
  { bgColor, textColor,  title }: HeaderProps
) {

  return (
    <View
      className={`
        w-full bg-${bgColor ? bgColor: 'green'}
        flex-row items-center justify-between pt-14 px-6
      `}>
      <Text className={`text-${textColor}`}></Text>
      <Text className={`text-${textColor} text-xl font-bold`}>{title && title}</Text>
      <Image source={require('~/assets/icons/settings.png')} className='h-8 w-8' />
    </View>
  );
}
