import { ref, computed } from 'vue';
import enTranslations from '@/i18n/en';
import faTranslations from '@/i18n/fa';

export type Language = 'en' | 'fa';

const currentLanguage = ref<Language>((localStorage.getItem('language') as Language) || 'en');

const translations = {
  en: enTranslations,
  fa: faTranslations,
};

const titles = {
  en: 'Amir Esfandyiari - Full Stack Developer',
  fa: 'امیررضا اسفندیاری - فول استک دولوپر',
};

function updateDocumentTitle(lang: Language) {
  if (typeof document !== 'undefined') {
    document.title = titles[lang];
  }
}

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang;
    localStorage.setItem('language', lang);
    // Update document direction for RTL support
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Update document title
    updateDocumentTitle(lang);
  };

  const t = computed(() => {
    return translations[currentLanguage.value] || translations.en;
  });

  const isRTL = computed(() => currentLanguage.value === 'fa');

  // Initialize direction and title on mount
  if (typeof window !== 'undefined') {
    document.documentElement.dir = currentLanguage.value === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage.value;
    updateDocumentTitle(currentLanguage.value);
  }

  return {
    currentLanguage,
    t,
    isRTL,
    setLanguage,
  };
}

