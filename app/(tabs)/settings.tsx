import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rgba, useThemeColors } from '@/components/home/useThemeColors';
import { useTheme } from '@/app/_context/ThemeContext';
import { useScrollHandler } from '@/lib/useScrollHandler';
import { db } from '@/db';
import { transactions, plannedTransactions, categories } from '@/db/schema';
import * as Linking from 'expo-linking';

const APP_VERSION = '1.0.0';
const GITHUB_URL = 'https://github.com/yourusername/kolandela';
const BUY_COFFEE_URL = 'https://buymeacoffee.com/yourusername';

// ── Reusable row components ───────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  const { mutedColor } = useThemeColors();
  return (
    <Text style={{
      color: mutedColor, fontSize: 11, fontWeight: '600',
      letterSpacing: 1.5, textTransform: 'uppercase',
      paddingHorizontal: 24, marginBottom: 8, marginTop: 24,
    }}>
      {label}
    </Text>
  );
}

function SettingsRow({
  icon, iconColor, label, sublabel, onPress, right, danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const { textColor, mutedColor, cardBg, isDark } = useThemeColors();
  const resolvedIconColor = iconColor ?? (isDark ? 'rgb(162,162,181)' : 'rgb(100,100,125)');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.65 : 1}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: cardBg,
        paddingHorizontal: 16, paddingVertical: 14,
        gap: 14,
      }}>
      {/* Icon bubble */}
      <View style={{
        width: 34, height: 34, borderRadius: 9,
        backgroundColor: rgba(resolvedIconColor, 0.1),
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Ionicons name={icon} size={17} color={danger ? 'rgb(255,59,48)' : resolvedIconColor} />
      </View>

      {/* Labels */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? 'rgb(255,59,48)' : textColor, fontSize: 14, fontWeight: '500' }}>
          {label}
        </Text>
        {sublabel && (
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>{sublabel}</Text>
        )}
      </View>

      {/* Right side */}
      {right ?? (onPress && (
        <Ionicons name="chevron-forward" size={15} color={mutedColor} />
      ))}
    </TouchableOpacity>
  );
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
  const { cardBg, borderColor } = useThemeColors();
  return (
    <View style={{
      marginHorizontal: 16,
      backgroundColor: cardBg,
      borderRadius: 18,
      borderWidth: 1,
      borderColor,
      overflow: 'hidden',
    }}>
      {children}
    </View>
  );
}

function Divider() {
  const { borderColor } = useThemeColors();
  return (
    <View style={{ height: 1, backgroundColor: borderColor, marginLeft: 64 }} />
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { textColor, mutedColor, primaryColor, isDark } = useThemeColors();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollHandler = useScrollHandler();

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete all data',
      'This will permanently delete all your transactions, planned transactions and custom categories. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.delete(transactions);
              await db.delete(plannedTransactions);
              await db.delete(categories).where(
                // only delete non-default categories to preserve seeds
                // if you want to wipe all: just db.delete(categories)
              );
              Alert.alert('Done', 'All data has been deleted.');
            } catch (e) {
              Alert.alert('Error', 'Something went wrong while deleting data.');
            }
          },
        },
      ]
    );
  };

  const handleExport = () => {
    // TODO: implement CSV/JSON export
    Alert.alert('Coming soon', 'Export will be available in a future update.');
  };

  const handleImport = () => {
    // TODO: implement import
    Alert.alert('Coming soon', 'Import will be available in a future update.');
  };

  const themeLabel =
    theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light';

  const cycleTheme = () => {
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
  };

  return (
    <ScrollView
      className="bg-background flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top }}
      {...scrollHandler}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          App
        </Text>
        <Text style={{ color: textColor, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
          Settings
        </Text>
      </View>

      {/* ── Appearance ── */}
      <SectionLabel label="Appearance" />
      <SettingsGroup>
        <SettingsRow
          icon={resolvedTheme === 'dark' ? 'moon' : 'sunny'}
          iconColor={primaryColor}
          label="Theme"
          sublabel={themeLabel}
          onPress={cycleTheme}
          right={
            <View style={{
              backgroundColor: rgba(primaryColor, 0.1), borderRadius: 100,
              paddingHorizontal: 10, paddingVertical: 4,
            }}>
              <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '600' }}>{themeLabel}</Text>
            </View>
          }
        />
      </SettingsGroup>

      {/* ── Preferences ── */}
      <SectionLabel label="Preferences" />
      <SettingsGroup>
        <SettingsRow
          icon="language-outline"
          label="Language"
          sublabel="English"
          onPress={() => Alert.alert('Coming soon', 'More languages will be supported soon.')}
        />
        <Divider />
        <SettingsRow
          icon="cash-outline"
          label="Currency"
          sublabel="XAF — Central African CFA"
          onPress={() => Alert.alert('Coming soon', 'Currency selection coming soon.')}
        />
      </SettingsGroup>

      {/* ── Data ── */}
      <SectionLabel label="Data" />
      <SettingsGroup>
        <SettingsRow
          icon="download-outline"
          iconColor={isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)'}
          label="Export data"
          sublabel="Save your data as CSV or JSON"
          onPress={handleExport}
        />
        <Divider />
        <SettingsRow
          icon="cloud-upload-outline"
          iconColor={isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)'}
          label="Import data"
          sublabel="Restore from a previous export"
          onPress={handleImport}
        />
      </SettingsGroup>

      {/* ── About ── */}
      <SectionLabel label="About" />
      <SettingsGroup>
        <SettingsRow
          icon="logo-github"
          iconColor={isDark ? 'rgb(229,229,229)' : 'rgb(40,40,55)'}
          label="Source code"
          sublabel="View on GitHub"
          onPress={() => Linking.openURL(GITHUB_URL)}
        />
        <Divider />
        {/*
        <SettingsRow
          icon="cafe-outline"
          label="Buy me a coffee"
          sublabel="Support development"
          onPress={() => Linking.openURL(BUY_COFFEE_URL)}
        />
        <Divider />*/}
        <SettingsRow
          icon="information-circle-outline"
          label="Version"
          sublabel={`Kolandela v${APP_VERSION}`}
          right={
            <Text style={{ color: mutedColor, fontSize: 12 }}>v{APP_VERSION}</Text>
          }
        />
      </SettingsGroup>

      {/* ── Danger zone ── */}
      <SectionLabel label="Danger zone" />
      <SettingsGroup>
        <SettingsRow
          icon="trash-outline"
          label="Delete all data"
          sublabel="Permanently removes all transactions and categories"
          onPress={handleDeleteAllData}
          danger
        />
      </SettingsGroup>

      {/* ── Footer ── */}
      <Text style={{
        color: mutedColor, fontSize: 11, textAlign: 'center',
        marginTop: 32, marginBottom: 8,
      }}>
        Made with ♥ · Kolandela v{APP_VERSION}
      </Text>

    </ScrollView>
  );
}
