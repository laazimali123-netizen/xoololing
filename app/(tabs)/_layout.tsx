// ─── Tabs Layout ─────────────────────────────────────────────────────
import React from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Colors, FontSizes } from '../../src/constants/theme';
import i18n from '../../src/i18n';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textHint,
        tabBarLabelStyle: {
          fontSize: FontSizes.caption,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.divider,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('home'),
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: i18n.t('browse'),
          tabBarIcon: ({ color }) => <TabIcon emoji="🔍" />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: i18n.t('sell'),
          tabBarIcon: ({ color }) => <TabIcon emoji="💰" />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: i18n.t('chat'),
          tabBarIcon: ({ color }) => <TabIcon emoji="💬" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t('profile'),
          tabBarIcon: ({ color }) => <TabIcon emoji="👤" />,
        }}
      />
    </Tabs>
  );
}
