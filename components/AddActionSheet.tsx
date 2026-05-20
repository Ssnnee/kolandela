import { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';

export const AddActionSheet = forwardRef<any, {}>((_props, ref) => {
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, isDark } =
    useThemeColors();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 24,
        stiffness: 240,
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

  const handleTransaction = () => {
    setVisible(false);
    router.push('/transactions/add');
  };

  const handlePlanned = () => {
    setVisible(false);
    router.push('/planned-transactions/add');
  };

  return (
    <Modal visible={visible} transparent onRequestClose={() => setVisible(false)}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
        onPress={() => setVisible(false)}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [360, 0],
                }),
              },
            ],
          }}>
          <View
            style={{
              backgroundColor: cardBg,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingHorizontal: 24,
              paddingBottom: 24 + insets.bottom,
              borderWidth: 1,
              borderColor,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: isDark ? 0.4 : 0.1,
              shadowRadius: 16,
              elevation: 20,
            }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: isDark ? 'rgb(60, 60, 72)' : 'rgb(200, 200, 210)',
                }}
              />
            </View>

            <Text
              style={{
                color: textColor,
                fontSize: 17,
                fontWeight: '700',
                marginBottom: 20,
                textAlign: 'center',
              }}>
              Add new
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleTransaction}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: rgba(primaryColor, 0.12),
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  gap: 10,
                  borderWidth: 1,
                  borderColor: rgba(primaryColor, 0.25),
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: primaryColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                </View>
                <Text style={{ color: primaryColor, fontSize: 14, fontWeight: '700' }}>
                  Transaction
                </Text>
                <Text
                  style={{
                    color: mutedColor,
                    fontSize: 11,
                    textAlign: 'center',
                    lineHeight: 15,
                  }}>
                  Record income or expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlanned}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: rgba(violetColor, 0.12),
                  borderRadius: 16,
                  padding: 20,
                  alignItems: 'center',
                  gap: 10,
                  borderWidth: 1,
                  borderColor: rgba(violetColor, 0.25),
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: violetColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="calendar-outline" size={24} color="white" />
                </View>
                <Text style={{ color: violetColor, fontSize: 14, fontWeight: '700' }}>Planned</Text>
                <Text
                  style={{
                    color: mutedColor,
                    fontSize: 11,
                    textAlign: 'center',
                    lineHeight: 15,
                  }}>
                  Schedule a future transaction
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
