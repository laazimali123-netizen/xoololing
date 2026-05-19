// ─── Welcome Screen ──────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import i18n from '../../src/i18n';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🐄</Text>
          <Text style={styles.appName}>{i18n.t('app_name')}</Text>
        </View>
        <Text style={styles.tagline}>{i18n.t('tagline')}</Text>
        <Text style={styles.subtitle}>{i18n.t('welcome_subtitle')}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>{i18n.t('login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerButtonText}>{i18n.t('register')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Somalia's Digital Livestock Marketplace</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSizes.title,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.body,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadii.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.subheading,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  footerText: {
    color: '#FFFFFF',
    opacity: 0.5,
    fontSize: FontSizes.caption,
  },
});
