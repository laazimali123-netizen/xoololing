// ─── Chat Detail Screen ──────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, BorderRadii } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/app-store';
import api from '../../src/lib/api';
import i18n from '../../src/i18n';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      const response = await api.getMessages(id);
      if (response.success && response.data) {
        setMessages(response.data.items || response.data);
      }
    } catch {
      // Empty on error
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    try {
      const response = await api.sendMessage(id, text);
      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
      }
    } catch {
      setInput(text); // Restore on error
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        <View style={[styles.messageBubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.messageText, isMine && styles.messageTextMine]}>{item.text}</Text>
          <Text style={[styles.messageTime, isMine && styles.messageTimeMine]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('chat')}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        inverted={messages.length > 0}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyText}>Start the conversation</Text>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textHint}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  backButton: { color: Colors.primary, fontSize: FontSizes.body },
  headerTitle: { fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.text },
  messageList: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, flexGrow: 1 },
  messageRow: { marginBottom: Spacing.sm, alignItems: 'flex-start' },
  messageRowMine: { alignItems: 'flex-end' },
  messageBubble: {
    maxWidth: '75%', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadii.lg, backgroundColor: Colors.surface,
  },
  bubbleMine: { backgroundColor: Colors.primary },
  bubbleOther: { backgroundColor: Colors.surface },
  messageText: { fontSize: FontSizes.body, color: Colors.text },
  messageTextMine: { color: '#FFFFFF' },
  messageTime: { fontSize: 10, color: Colors.textHint, marginTop: 4, textAlign: 'right' },
  messageTimeMine: { color: '#FFFFFF80' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  textInput: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadii.xxl,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    fontSize: FontSizes.body, color: Colors.text, maxHeight: 100,
  },
  sendButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonText: { color: '#FFFFFF', fontSize: 20 },
  emptyState: { alignItems: 'center', paddingTop: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSizes.body, color: Colors.textSecondary },
});
