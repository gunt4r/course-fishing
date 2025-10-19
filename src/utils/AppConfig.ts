import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, ruRU, roRO } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Course fishing',
  locales: ['en', 'ro', 'ru'],
  defaultLocale: 'ro',
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  ro: roRO,
  ru: ruRU,
};

export const ClerkLocalizations = {
  defaultLocale: roRO,
  supportedLocales,
};
