import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { isIOS } from '@/constants/platform';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, font, radius, spacing } from '@/constants/theme';

export default function FormScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);

  const onSubmit = () => {
    Keyboard.dismiss();
    setSubmitted(`${name.trim() || '—'} · ${email.trim() || 'no email'}`);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={isIOS ? 'padding' : undefined}>
      <Pressable style={styles.root} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        </View>

        {submitted ? <Text style={styles.result}>Submitted: {submitted}</Text> : null}

        <View style={styles.flex} />

        <PrimaryButton label="Submit" onPress={onSubmit} />
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: font.size.lg,
  },
  result: {
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
});
