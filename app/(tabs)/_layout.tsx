import { Link, Tabs } from "expo-router";
import { TabBarIcon } from '../../components/TabBarIcon';
import { BlurView } from 'expo-blur';
import { Image, StyleSheet, View } from 'react-native'
import homeIcon from '../../assets/icons/Home.png'
import budgetIcon from '../../assets/icons/Budgets.png'
import calendarIcon from '../../assets/icons/Calendar.png'
import creditCardIcon from '../../assets/icons/CreditCards.png'



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#4E4E61',
          borderRadius: 15,
          height: 60,
          borderTopColor: 'transparent',
        },

        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: 'hidden',
              borderRadius: 15,
            }}
          />
        ),
      }}
    >
        <Tabs.Screen
        name='index'
        options={{
          title: 'Start',
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
          title: 'Start',
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
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

        <Tabs.Screen
        name='calendar/index'
        options={{
          title: 'Start',
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

        <Tabs.Screen
        name='income/index'
        options={{
          title: 'Start',
          tabBarIcon : ({focused}) => (
            <View className="" >
              <Image
              source={creditCardIcon}
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

