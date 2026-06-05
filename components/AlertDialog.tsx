import { useRef, useEffect } from 'react';
import { Modal, Pressable, Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/components/home/useThemeColors';

interface AlertDialogProps {
  visible: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  media?: keyof typeof Ionicons.glyphMap;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
}

export function AlertDialog({
  visible,
  onOpenChange,
  title,
  description,
  media,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
}: AlertDialogProps) {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor, isDark } = useThemeColors();
  const scale = useRef(new Animated.Value(0.95)).current;
  const translateY = useRef(new Animated.Value(15)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.95);
      translateY.setValue(15);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, damping: 24, stiffness: 320, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, damping: 24, stiffness: 320, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 15, duration: 150, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const hasConfirm = !!confirmLabel;
  const actionColor = destructive ? 'rgb(255,59,48)' : primaryColor;
  
  // Stack buttons vertically if either label is longer than 8 characters
  const isStacked = hasConfirm && ((confirmLabel?.length ?? 0) > 8 || (cancelLabel?.length ?? 0) > 8);

  return (
    <Modal visible={visible} transparent onRequestClose={handleCancel}>
      <Pressable style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={handleCancel}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.45)',
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: 280,
            backgroundColor: cardBg,
            borderRadius: 20,
            borderWidth: 1,
            borderColor,
            padding: 24,
            paddingBottom: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
            elevation: 16,
            transform: [{ scale }, { translateY }],
            opacity,
          }}>
          {media && (
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: destructive ? 'rgba(255,59,48,0.1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ionicons
                  name={media}
                  size={24}
                  color={destructive ? 'rgb(255,59,48)' : mutedColor}
                />
              </View>
            </View>
          )}

          <Text
            style={{
              color: destructive ? 'rgb(255,59,48)' : textColor,
              fontSize: 17,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: description ? 8 : 20,
            }}>
            {title}
          </Text>

          {description && (
            <Text
              style={{
                color: mutedColor,
                fontSize: 13,
                textAlign: 'center',
                lineHeight: 19,
                marginBottom: 24,
              }}>
              {description}
            </Text>
          )}

          <View
            style={{
              flexDirection: isStacked ? 'column' : 'row',
              gap: 8,
              borderTopWidth: 1,
              borderTopColor: borderColor,
              marginHorizontal: -24,
              paddingHorizontal: 24,
              paddingVertical: 14,
            }}>
            {!hasConfirm ? (
              <TouchableOpacity
                onPress={handleCancel}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 12,
                  backgroundColor: isDark ? 'rgb(38,38,47)' : 'rgb(245,245,248)',
                  alignItems: 'center',
                }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>OK</Text>
              </TouchableOpacity>
            ) : isStacked ? (
              <>
                <TouchableOpacity
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                  style={{
                    width: '100%',
                    paddingVertical: 11,
                    borderRadius: 12,
                    backgroundColor: actionColor,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {confirmLabel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  style={{
                    width: '100%',
                    paddingVertical: 11,
                    borderRadius: 12,
                    backgroundColor: isDark ? 'rgb(38,38,47)' : 'rgb(245,245,248)',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {cancelLabel}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    paddingVertical: 11,
                    borderRadius: 12,
                    backgroundColor: isDark ? 'rgb(38,38,47)' : 'rgb(245,245,248)',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {cancelLabel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 11,
                    borderRadius: 12,
                    backgroundColor: actionColor,
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {confirmLabel}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
