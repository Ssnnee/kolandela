/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF7966';
const tintColorDark = '#00FAD9';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#666680',
    tabIconDefault: '#83839C',
    tabIconSelected: tintColorLight,
    backgroundVariant: '#F0F0F5',
    primary: '#AD7BFF',
    error: '#FF3B30',
    success: '#00C4A7',
    grayLight: '#A2A2B5',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0E0E12',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#666680',
    tabIconSelected: tintColorDark,
    backgroundVariant: '#26262F',
    primary: '#AD7BFF',
    error: '#FF3B30',
    success: '#00FAD9',
    grayLight: '#A2A2B5',
  },
};

