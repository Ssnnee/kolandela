import { View, TouchableOpacity } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { useThemeColors } from '@/components/home/useThemeColors';
import { Ionicons } from '@expo/vector-icons';

type ContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

function Container({ children, style }: ContainerProps) {
  const { cardBg, borderColor } = useThemeColors();
  return (
    <View
      style={[
        {
          backgroundColor: cardBg,
          borderRadius: 24,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 16,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type RowProps = {
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  chevronColor?: string;
};

function Row({ icon, iconBg, children, onPress, showChevron, chevronColor }: RowProps) {
  const { mutedColor } = useThemeColors();
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={chevronColor ?? mutedColor} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

function Divider() {
  const { borderColor } = useThemeColors();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: borderColor,
        marginHorizontal: -16,
      }}
    />
  );
}

export const DetailCard = { Container, Row, Divider };
