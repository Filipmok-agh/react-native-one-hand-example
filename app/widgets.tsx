import DateTimePicker from '@react-native-community/datetimepicker';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { isAndroid } from '@/constants/platform';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, font, radius, spacing } from '@/constants/theme';

const VIDEO_SOURCE = require('../assets/sample-video.mp4');

export default function WidgetsScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [lastAction, setLastAction] = useState<string | null>(null);
  const player = useVideoPlayer(VIDEO_SOURCE);

  const pickFromMenu = (action: string) => {
    setMenuVisible(false);
    setLastAction(action);
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Selection toolbar</Text>
        <TextInput
          style={styles.selectionInput}
          defaultValue="Long-press to select this text — the native selection toolbar (an anchored popup window) will appear."
          showSoftInputOnFocus={false}
          multiline
        />

        {isAndroid ? (
          <>
            <Text style={styles.heading}>Native picker dialogs</Text>
            <PrimaryButton label="Date picker" onPress={() => setPicker('date')} />
            <PrimaryButton
              label="Time picker"
              variant="secondary"
              onPress={() => setPicker('time')}
            />
            {picker ? (
              <DateTimePicker
                value={dateTime}
                mode={picker}
                // The native dialog must be unmounted on ANY result, or it re-shows.
                onValueChange={(_event, selected) => {
                  setPicker(null);
                  setDateTime(selected);
                }}
                onDismiss={() => setPicker(null)}
              />
            ) : null}
            <Text style={styles.value}>
              Selected: {dateTime.toLocaleDateString()}{' '}
              {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </>
        ) : null}

        <Text style={styles.heading}>Anchored menu</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <PrimaryButton
              label="Open menu"
              variant="secondary"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item title="Duplicate" onPress={() => pickFromMenu('Duplicate')} />
          <Menu.Item title="Rename" onPress={() => pickFromMenu('Rename')} />
          <Menu.Item title="Move to…" onPress={() => pickFromMenu('Move to…')} />
        </Menu>
        {lastAction ? <Text style={styles.value}>Last menu action: {lastAction}</Text> : null}

        <Text style={styles.heading}>Video (native fullscreen)</Text>
        <VideoView
          player={player}
          style={styles.video}
          fullscreenOptions={{ enable: true }}
          nativeControls
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
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
  selectionInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: font.size.md,
    color: colors.text,
  },
  video: {
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});
