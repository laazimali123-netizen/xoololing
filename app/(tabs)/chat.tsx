// ─── Chat Tab ────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import api from '../../src/lib/api';
import i18n from '../../src/i18n';

interface ConversationItem {
  id: string;
  participants: { id: string; name: string; avatar?: string }[];
  lastMessage?: { text: string; createdAt: string };
  unreadCount: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAppStore();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadConversations(); }, []);

  const loadConversations = async () => {
    try {
      const response = await api.getConversations();
      if (response.success && response.data) {
        setConversations(response.data.items || response.data);
      }
    } catch {
      // Use empty state on error
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const getOtherParticipant = (conv: ConversationItem) => {
    return conv.participants.find((p) => p.id !== user?.id) || conv.participants[0];
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('chat')}</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Start a chat by contacting a seller</Text>
          </View>
        }
        renderItem={({ item }) => {
          const other = getOtherParticipant(item);
          return (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => router.push(`/chat/${item.id}`)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{other.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.convInfo}>
                <View style={styles.convTop}>
                  <Text style={styles.convName} numberOfLines={1}>{other.name}</Text>
                  {item.lastMessage && (
                    <Text style={styles.convTime}>{formatTime(item.lastMessage.createdAt)}</Text>
                  )}
                </View>
                {item.lastMessage && (
                  <Text style={styles.convMessage} numberOfLines={1}>{item.lastMessage.text}</Text>
                )}
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSizes.heading, fontWeight: 'bold', color: Colors.text },
  conversationItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: FontSizes.subheading, fontWeight: 'bold' },
  convInfo: { flex: 1, marginLeft: Spacing.md },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convName: { fontSize: FontSizes.subheading, fontWeight: '600', color: Colors.text, flex: 1 },
  convTime: { fontSize: FontSizes.caption, color: Colors.textHint },
  convMessage: { fontSize: FontSizes.caption, color: Colors.textSecondary, marginTop: 2 },
  unreadBadge: {
    backgroundColor: Colors.secondary, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2, marginLeft: Spacing.sm,
    minWidth: 20, alignItems: 'center',
  },
  unreadText: { color: '#FFFFFF', fontSize: FontSizes.caption, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.lg },
  emptyText: { fontSize: FontSizes.body, color: Colors.textSecondary },
  emptySubtext: { fontSize: FontSizes.caption, color: Colors.textHint, marginTop: Spacing.xs },
});
