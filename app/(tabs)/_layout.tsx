import {  Tabs } from "expo-router";
import { Image,  View } from 'react-native'
import homeIcon from '../../assets/icons/Home.png'
import budgetIcon from '../../assets/icons/Budgets.png'
import calendarIcon from '../../assets/icons/Calendar.png'
import creditCardIcon from '../../assets/icons/CreditCards.png'



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#0E0E12',
          borderRadius: 15,
          height: 60,
          borderColor: 'transparent',
        },

        headerStyle: {
          backgroundColor: '#4E4E61',
          elevation: 0,
        },

      }}
    >
        <Tabs.Screen
        name='index'
        options={{
          title: '',
          headerShown: true,
          tabBarIcon : ({focused}) => (
            <View className="" >
              <Image
              source={homeIcon}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
                tintColor: focused ? 'white' : '#A2A2B5',
              }}
            />
              </View>
          ),
        }}
      />

        <Tabs.Screen
        name='budget/index'
        options={{
          title: '',
          headerShown: true,
          tabBarIcon : ({focused}) => (
            <View className="" >
              <Image
              source={budgetIcon}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
                tintColor: focused ? 'white' : '#A2A2B5',
              }}
            />
              </View>
          ),
        }}
      />

        <Tabs.Screen
        name='calendar/index'
        options={{
          title: '',
          headerShown: true,
          tabBarIcon : ({focused}) => (
            <View className="" >
              <Image
              source={calendarIcon}
              resizeMode="contain"
              style={{
                width: 18,
                height: 18,
                tintColor: focused ? 'white' : '#A2A2B5',
              }}
            />
              </View>
          ),
        }}
      />

      </Tabs>
  );
}

