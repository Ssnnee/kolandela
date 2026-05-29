import { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/home/useThemeColors';

export const AddActionSheet = forwardRef<any, {}>((_props, ref) => {
  const { textColor, mutedColor, primaryColor, violetColor, isDark } = useThemeColors();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 26,
        stiffness: 260,
      }).start();
    },
    close: () => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    },
  }));

  const handleNavigation = (path: '/transactions/add' | '/planned-transactions/add') => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      router.push(path);
    });
  };

  return (
    <Modal visible={visible} transparent onRequestClose={() => setVisible(false)} animationType="none">
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
        onPress={() => setVisible(false)}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [320, 0],
                }),
              },
            ],
          }}>
          <View
            style={{
              backgroundColor: isDark ? 'rgb(20, 20, 26)' : '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingTop: 8,
              paddingHorizontal: 16,
              paddingBottom: 16 + insets.bottom,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            }}>

            {/* Grab Handle */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                }}
              />
            </View>

            {/* Title */}
            <Text
              style={{
                color: textColor,
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 16,
                marginLeft: 4,
                letterSpacing: -0.2,
              }}>
              What would you like to do?
            </Text>

            {/* Grid Container */}
            <View style={{ flexDirection: 'row', gap: 10 }}>

              {/* Add Card */}
              <TouchableOpacity
                onPress={() => handleNavigation('/transactions/add')}
                activeOpacity={0.75}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(255, 100, 80, 0.06)' : 'rgba(255, 100, 80, 0.03)',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255, 100, 80, 0.12)' : 'rgba(255, 100, 80, 0.06)',
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: primaryColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                  <Ionicons name="add-sharp" size={24} color="white" />
                </View>
                <Text style={{ color: primaryColor, fontSize: 17, fontWeight: '600', marginBottom: 4 }}>
                  Add
                </Text>
                <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '400', lineHeight: 16 }}>
                  New expense or income
                </Text>
              </TouchableOpacity>

              {/* Plan Card */}
              <TouchableOpacity
                onPress={() => handleNavigation('/planned-transactions/add')}
                activeOpacity={0.75}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(150, 120, 255, 0.06)' : 'rgba(150, 120, 255, 0.03)',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(150, 120, 255, 0.12)' : 'rgba(150, 120, 255, 0.06)',
                }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: violetColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                  <Ionicons name="calendar-sharp" size={18} color="white" />
                </View>
                <Text style={{ color: violetColor, fontSize: 17, fontWeight: '600', marginBottom: 4 }}>
                  Plan
                </Text>
                <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '400', lineHeight: 16 }}>
                  Schedule future transaction
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

export default AddActionSheet;
