import { getCalendars, getDefaultCalendarSync, requestCalendarPermissions } from 'expo-calendar';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, Share, StyleSheet, Text } from 'react-native';
import { isIOS } from '@/constants/platform';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, font, radius, spacing } from '@/constants/theme';

export default function SystemScreen() {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const takePhoto = async () => {
    if (!cameraPermission?.granted) {
      const response = await requestCameraPermission();
      if (!response.granted) return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch (error) {
      // iOS simulators have no camera — launchCameraAsync throws there.
      Alert.alert('Camera unavailable', error instanceof Error ? error.message : String(error));
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
    if (!result.canceled) setPickedUri(result.assets[0].uri);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) setDocumentName(result.assets[0].name);
  };

  const share = async () => {
    try {
      await Share.share({
        message: 'react-native-one-hand — one-hand mode for React Native apps.',
      });
    } catch {
      // Dismissed — nothing to do.
    }
  };

  const addToCalendar = async () => {
    const start = new Date(Date.now() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    try {
      const permission = await requestCalendarPermissions();
      if (!permission.granted) return;
      const calendar = isIOS
        ? getDefaultCalendarSync()
        : (await getCalendars()).find((entry) => entry.allowsModifications);
      if (!calendar) {
        throw new Error(
          'No writable calendar found — this device has no calendar account configured.',
        );
      }
      await calendar.addEventWithForm({
        title: 'react-native-one-hand demo',
        startDate: start,
        endDate: end,
      });
    } catch (error) {
      Alert.alert('Calendar unavailable', error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Native camera</Text>
      <PrimaryButton label="Take a photo" onPress={takePhoto} />
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.preview} /> : null}

      <Text style={styles.heading}>System photo picker</Text>
      <PrimaryButton label="Pick an image" variant="secondary" onPress={pickImage} />
      {pickedUri ? <Image source={{ uri: pickedUri }} style={styles.preview} /> : null}

      <Text style={styles.heading}>System document picker</Text>
      <PrimaryButton label="Pick a document" variant="secondary" onPress={pickDocument} />
      {documentName ? <Text style={styles.value}>Picked: {documentName}</Text> : null}

      <Text style={styles.heading}>Share sheet</Text>
      <PrimaryButton label="Share" variant="secondary" onPress={share} />

      <Text style={styles.heading}>Calendar event editor</Text>
      <PrimaryButton label="Add to calendar" variant="secondary" onPress={addToCalendar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  heading: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  value: {
    fontSize: font.size.sm,
    color: colors.textMuted,
  },
  preview: {
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    resizeMode: 'cover',
  },
});
