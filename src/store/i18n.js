import { reactive } from 'vue';
import { localeManager } from '@/locales/localeManager';

const LOCALE_STORAGE_KEY = 'datepicker_locale';

function loadLocaleFromStorage() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function saveLocaleToStorage(locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.log(error);
  }
}

const state = reactive({
  currentLocale: loadLocaleFromStorage() || 'jalali',
});

const i18nStore = {
  get currentLocale() {
    return state.currentLocale;
  },

  get locale() {
    return localeManager.get(state.currentLocale);
  },

  get availableLocales() {
    return localeManager.getAll();
  },

  get direction() {
    return localeManager.getDirection(state.currentLocale);
  },

  get numberSystem() {
    return localeManager.getNumberSystem(state.currentLocale);
  },

  get calendarType() {
    return localeManager.getCalendarType(state.currentLocale);
  },

  setLocale(localeCode) {
    if (localeManager.has(localeCode)) {
      state.currentLocale = localeCode;
      saveLocaleToStorage(localeCode);
    }
  },

  getMonthName(month) {
    return localeManager.getMonthName(month, state.currentLocale);
  },

  getWeekdayName(weekdays) {
    return localeManager.getWeekdayName(weekdays, state.currentLocale);
  },

  getText(key) {
    return localeManager.getText(key, state.currentLocale);
  },
};

export function useI18nStore() {
  return i18nStore;
}
