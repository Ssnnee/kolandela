import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rgba, useThemeColors, useCurrency } from '@/components/home/useThemeColors';
import { AlertDialog } from '@/components/AlertDialog';
import { DetailCard } from '@/components/DetailCard';
import { CurrencyPicker } from '@/components/forms/CurrencyPicker';
import { ThemePicker } from '@/components/forms/ThemePicker';
import { LanguagePicker } from '@/components/forms/LanguagePicker';
import { ExportPicker } from '@/components/forms/ExportPicker';
import { useTheme } from '@/app/_context/ThemeContext';
import { useTranslation } from '@/app/_context/LanguageContext';
import { useState } from 'react';
import * as transactionService from '@/services/transactions';
import * as plannedTransactionService from '@/services/plannedTransactions';
import * as categoryService from '@/services/categories';
import * as exportImportService from '@/services/exportImport';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { seedDatabase } from '@/db/seed';
import * as Linking from 'expo-linking';

const APP_VERSION = '0.0.1';
const GITHUB_URL = 'https://github.com/ssnnee/kolandela';
// const BUY_COFFEE_URL = 'https://buymeacoffee.com/yourusername';

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



// ── Main Screen ───────────────────────────────────────────────────────────────

type DialogState = {
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
} | null;

export default function SettingsScreen() {
  const { textColor, mutedColor, primaryColor, isDark } = useThemeColors();
  const { currency } = useCurrency();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showExportPicker, setShowExportPicker] = useState(false);
  const { resolvedTheme, theme } = useTheme();
  const { language, t } = useTranslation();
  const [dialog, setDialog] = useState<DialogState>(null);

  const handleDeleteAllData = () => {
    setDialog({
      title: t('global.dialogs.deleteAllData'),
      description: t('global.dialogs.deleteAllDataDesc'),
      confirmLabel: t('global.dialogs.deleteEverything'),
      destructive: true,
      onConfirm: async () => {
        try {
          await transactionService.deleteAll();
          await plannedTransactionService.deleteAll();
          await categoryService.deleteAll();
          await seedDatabase();
          setDialog({ title: t('global.dialogs.done'), description: t('global.dialogs.allDataDeleted') });
        } catch {
          setDialog({ title: t('global.dialogs.error'), description: t('global.dialogs.somethingWentWrong') });
        }
      },
    });
  };

  const handleExport = () => {
    setShowExportPicker(true);
  };

  const handleSelectExportFormat = async (format: 'JSON' | 'CSV') => {
    try {
      if (format === 'JSON') {
        await exportImportService.exportToJSON();
      } else {
        await exportImportService.exportToCSV();
      }
    } catch (err: any) {
      setDialog({
        title: t('global.dialogs.error'),
        description: err?.message || t('global.dialogs.somethingWentWrong'),
      });
    }
  };

  const handleRestoreContent = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (
        !data ||
        typeof data.version !== 'number' ||
        !Array.isArray(data.categories) ||
        !Array.isArray(data.transactions) ||
        !Array.isArray(data.plannedTransactions) ||
        !Array.isArray(data.plannedTransactionExecutions)
      ) {
        setDialog({
          title: t('global.dialogs.importErrorInvalid'),
          description: t('global.dialogs.importErrorInvalidDesc'),
        });
        return;
      }
    } catch {
      setDialog({
        title: t('global.dialogs.importErrorInvalid'),
        description: t('global.dialogs.importErrorInvalidDesc'),
      });
      return;
    }

    setDialog({
      title: t('global.dialogs.importConfirmTitle'),
      description: t('global.dialogs.importConfirmDesc'),
      confirmLabel: t('global.dialogs.importConfirmButton'),
      destructive: true,
      onConfirm: async () => {
        try {
          await exportImportService.importFromJSON(jsonString);
          setDialog({
            title: t('global.dialogs.importSuccess'),
            description: t('global.dialogs.importSuccessDesc'),
          });
        } catch (err: any) {
          setDialog({
            title: t('global.dialogs.error'),
            description: err?.message || t('global.dialogs.somethingWentWrong'),
          });
        }
      },
    });
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: 'utf8' });
        handleRestoreContent(fileContent);
      }
    } catch (err: any) {
      setDialog({
        title: t('global.dialogs.error'),
        description: err?.message || t('global.dialogs.somethingWentWrong'),
      });
    }
  };

  const themeLabel =
    theme === 'system' ? t('global.theme.system') : theme === 'dark' ? t('global.theme.dark') : t('global.theme.light');

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            {t('tabs.settings.headerLabel')}
          </Text>
          <Text style={{ color: textColor, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            {t('tabs.settings.title')}
          </Text>
        </View>

        {/* ── Appearance ── */}
        <SectionLabel label={t('tabs.settings.sectionAppearance')} />
        <DetailCard.Container style={{ borderRadius: 18, marginHorizontal: 16, paddingHorizontal: 0 }}>
          <SettingsRow
            icon={resolvedTheme === 'dark' ? 'moon' : 'sunny'}
            iconColor={primaryColor}
            label={t('tabs.settings.theme')}
            sublabel={themeLabel}
            onPress={() => setShowThemePicker(true)}
            right={
              <View style={{
                backgroundColor: rgba(primaryColor, 0.1), borderRadius: 100,
                paddingHorizontal: 10, paddingVertical: 4,
              }}>
                <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '600' }}>{themeLabel}</Text>
              </View>
            }
          />
        </DetailCard.Container>

        {/* ── Preferences ── */}
        <SectionLabel label={t('tabs.settings.sectionPreferences')} />
        <DetailCard.Container style={{ borderRadius: 18, marginHorizontal: 16, paddingHorizontal: 0 }}>
          <SettingsRow
            icon="language-outline"
            label={t('tabs.settings.language')}
            sublabel={language === 'en' ? t('tabs.settings.english') : 'Français'}
            onPress={() => setShowLanguagePicker(true)}
          />
          <DetailCard.Divider />
          <SettingsRow
            icon="cash-outline"
            label={t('tabs.settings.currency')}
            sublabel={`${currency.code} — ${currency.symbol}`}
            onPress={() => setShowCurrencyPicker(true)}
          />
        </DetailCard.Container>

        {/* ── Data ── */}
        <SectionLabel label={t('tabs.settings.sectionData')} />
        <DetailCard.Container style={{ borderRadius: 18, marginHorizontal: 16, paddingHorizontal: 0 }}>
          <SettingsRow
            icon="download-outline"
            iconColor={isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)'}
            label={t('tabs.settings.exportData')}
            sublabel={t('tabs.settings.exportSublabel')}
            onPress={handleExport}
          />
          <DetailCard.Divider />
          <SettingsRow
            icon="cloud-upload-outline"
            iconColor={isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)'}
            label={t('tabs.settings.importData')}
            sublabel={t('tabs.settings.importSublabel')}
            onPress={handleImport}
          />
        </DetailCard.Container>

        {/* ── About ── */}
        <SectionLabel label={t('tabs.settings.sectionAbout')} />
        <DetailCard.Container style={{ borderRadius: 18, marginHorizontal: 16, paddingHorizontal: 0 }}>
          <SettingsRow
            icon="logo-github"
            iconColor={isDark ? 'rgb(229,229,229)' : 'rgb(40,40,55)'}
            label={t('tabs.settings.sourceCode')}
            sublabel={t('tabs.settings.viewOnGitHub')}
            onPress={() => Linking.openURL(GITHUB_URL)}
          />
          <DetailCard.Divider />
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
            label={t('tabs.settings.version')}
            sublabel={`Kolandela v${APP_VERSION}`}
            right={
              <Text style={{ color: mutedColor, fontSize: 12 }}>v{APP_VERSION}</Text>
            }
          />
        </DetailCard.Container>

        {/* ── Danger zone ── */}
        <SectionLabel label={t('tabs.settings.sectionDanger')} />
        <DetailCard.Container style={{ borderRadius: 18, marginHorizontal: 16, paddingHorizontal: 0 }}>
          <SettingsRow
            icon="trash-outline"
            label={t('tabs.settings.deleteAllData')}
            sublabel={t('tabs.settings.deleteAllDataSublabel')}
            onPress={handleDeleteAllData}
            danger
          />
        </DetailCard.Container>

        {/* ── Footer ── */}
        <Text style={{
          color: mutedColor, fontSize: 11, textAlign: 'center',
          marginTop: 32, marginBottom: 8,
        }}>
          {t('tabs.settings.footer', { version: APP_VERSION })}
        </Text>

        <LanguagePicker visible={showLanguagePicker} onClose={() => setShowLanguagePicker(false)} />
        <CurrencyPicker visible={showCurrencyPicker} onClose={() => setShowCurrencyPicker(false)} />
        <ThemePicker visible={showThemePicker} onClose={() => setShowThemePicker(false)} />
        <ExportPicker visible={showExportPicker} onClose={() => setShowExportPicker(false)} onSelect={handleSelectExportFormat} />

        <AlertDialog
          visible={dialog !== null}
          onOpenChange={() => setDialog(null)}
          title={dialog?.title ?? ''}
          description={dialog?.description}
          confirmLabel={dialog?.confirmLabel}
          destructive={dialog?.destructive}
          onConfirm={dialog?.onConfirm}
        />
      </ScrollView>
    </SafeAreaView>

  );
}
