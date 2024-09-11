import { useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export type TabButtonType = {
  title: string;
};

export type TabButtonProps = {
  buttons: TabButtonType[];
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
};

export default function TabButton(
  {
    buttons,
    selectedTab,
    setSelectedTab
  }: TabButtonProps) {

  const [dimensions, setDimensions] = useState({ width: 100, height: 20 });
  const buttonWidth = dimensions.width / buttons.length;
  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const handleTabPress = (index: number) => {
    setSelectedTab(index);
  };

  const onTabPress = (index: number) => {
    tabPositionX.value = withTiming(buttonWidth * index, {}, () => {
      runOnJS(handleTabPress)(index);
    });
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      accessibilityRole='switch'
      className='bg-dark rounded-3xl justify-center p-3 mx-5 mt-3 '
    >
        <Animated.View
        className='absolute bg-foreground rounded-full mx-3 border-2 border-[#4E4E61]'
        style={[animatedStyles, {
          height: dimensions.height - 8,
          width: buttonWidth - 8,
        }]}
      />

        <View className='flex-row' onLayout={onTabbarLayout}>
          { buttons.map((button, index) => {
            const color = selectedTab === index ? 'text-white' : 'text-foreground';
            return (
              <Pressable
                onPress={() => onTabPress(index)}
                key={index}
                className='flex-1 py-4'
              >
                  <Text className={`self-center font-bold ${color}`}> {button.title} </Text>
                </Pressable>
            )
          })}
        </View>
      </View>
  );
}
