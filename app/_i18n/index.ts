import en from './dictionaries/en.json';
import fr from './dictionaries/fr.json';

export const translations = { en, fr } as const;
export type LanguageCode = keyof typeof translations;

// Simple helper to resolve nested paths (e.g. "global.actions.add")
export function translate(lang: LanguageCode, path: string, params?: Record<string, string | number>): string {
  const keys = path.split('.');
  let current: any = translations[lang];

  for (const key of keys) {
    if (current && current[key] !== undefined) {
      current = current[key];
    } else {
      return path; // Fallback to key path if missing
    }
  }

  if (typeof current === 'string' && params) {
    return current.replace(/\{\{(\w+)\}\}/g, (_, key) => String(params[key] ?? `{{${key}}}`));
  }

  return current;
}
