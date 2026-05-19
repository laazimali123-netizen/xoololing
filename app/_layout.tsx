// ─── Root Layout ─────────────────────────────────────────────────────
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../src/store/app-store';
import { setLanguage } from '../src/i18n';

export default function RootLayout() {
  const { initialize, language } = useAppStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAFAFA' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
