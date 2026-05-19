// ─── Root Layout ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Let fonts and assets load
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsReady(true);
      } catch (e: any) {
        console.error('Layout init error:', e);
        setError(e.message || 'Failed to load');
        setIsReady(true);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // Splash may already be hidden
        }
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAFAFA' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="animal/[id]" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="transaction/[id]" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="admin" />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
