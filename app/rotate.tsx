import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, font, spacing } from '@/constants/theme';

export default function RotateScreen() {
  const [orientation, setOrientation] = useState<string>('unknown');

  useEffect(() => {
    let mounted = true;
    const describe = (value: ScreenOrientation.Orientation) =>
      ScreenOrientation.Orientation[value] ?? String(value);

    ScreenOrientation.getOrientationAsync().then((value) => {
      if (mounted) setOrientation(describe(value));
    });
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(describe(event.orientationInfo.orientation));
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const lock = (value: ScreenOrientation.OrientationLock) => {
    void ScreenOrientation.lockAsync(value);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.orientation}>Current orientation: {orientation}</Text>
      <PrimaryButton
        label="Lock portrait"
        onPress={() => lock(ScreenOrientation.OrientationLock.PORTRAIT_UP)}
      />
      <PrimaryButton
        label="Lock landscape left"
        onPress={() => lock(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)}
      />
      <PrimaryButton
        label="Lock landscape right"
        onPress={() => lock(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)}
      />
      <PrimaryButton
        label="Unlock (follow device)"
        variant="secondary"
        onPress={() => void ScreenOrientation.unlockAsync()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  orientation: {
    fontSize: font.size.body,
    fontWeight: font.weight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
