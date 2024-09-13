export function capitalizeFirstLetters(string: string) {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}


      //   <Tabs.Screen
      //   name='calendar/index'
      //   options={{
      //     title: '',
      //     headerShown: true,
      //     tabBarIcon : ({focused}) => (
      //       <View className="" >
      //         <Image
      //         source={calendarIcon}
      //         resizeMode="contain"
      //         style={{
      //           width: 18,
      //           height: 18,
      //           tintColor: focused ? 'white' : '#A2A2B5',
      //         }}
      //       />
      //         </View>
      //     ),
      //   }}
      // />
      //
      //   <Tabs.Screen
