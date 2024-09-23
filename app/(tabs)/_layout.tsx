import {  Tabs } from "expo-router";
import { ChartNoAxesColumn, Home, Layers3 } from "lucide-react-native";
import { View } from 'react-native'



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          elevation: 0,
          backgroundColor: '#0E0E12',
          height: 60,
          borderColor: '#666680',
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
          tabBarLabel() {
            return <View></View>
          },
          tabBarIcon : ({focused}) => (
            <Home color={focused ? 'white' : '#A2A2B5'} size={24} />
          ),
        }}
      />

        <Tabs.Screen
        name='budget/index'
        options={{
          title: '',
          headerShown: true,
          tabBarLabel() {
            return <View></View>
          },
          tabBarIcon : ({focused}) => (
            <Layers3 color={focused ? 'white' : '#A2A2B5'} size={24} />
          ),
        }}
      />

        <Tabs.Screen
        name='calendar/index'
        options={{
          title: '',
          headerShown: true,
          tabBarLabel() {
            return <View></View>
          },
          tabBarIcon : ({focused}) => (
            <ChartNoAxesColumn color={focused ? 'white' : '#A2A2B5'} size={24} />
          ),
        }}
      />

      </Tabs>
  );
}
