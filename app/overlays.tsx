import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNModal from 'react-native-modal';
import {
  Button as PaperButton,
  Dialog,
  Portal,
  Snackbar,
  Text as PaperText,
} from 'react-native-paper';
import { FullWindowOverlay } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hideBannerWindow, showBannerWindow } from '../modules/banner-window';
import { isIOS } from '@/constants/platform';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, font, radius, spacing } from '@/constants/theme';

const SHEET_ACTIONS = ['Share', 'Edit', 'Archive', 'Delete'];

export default function OverlaysScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [rnModalVisible, setRnModalVisible] = useState(false);
  const [paperVisible, setPaperVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);

  const openSheet = useCallback(() => sheetRef.current?.expand(), []);
  const closeSheet = useCallback(() => sheetRef.current?.close(), []);

  const showAlert = () => {
    Alert.alert('Native Alert', 'This is a native Alert.alert with two buttons.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => undefined },
    ]);
  };

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'ActionSheetIOS',
        options: ['Cancel', 'Share', 'Delete'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
      },
      () => undefined,
    );
  };

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Native overlays</Text>
        <PrimaryButton label="Native Modal" onPress={() => setModalVisible(true)} />
        <PrimaryButton label="Native Alert.alert" variant="secondary" onPress={showAlert} />
        {isIOS ? (
          <PrimaryButton label="ActionSheetIOS" variant="secondary" onPress={showActionSheet} />
        ) : null}
        <PrimaryButton
          label="react-native-modal"
          variant="secondary"
          onPress={() => setRnModalVisible(true)}
        />

        <Text style={styles.heading}>In-tree / portals</Text>
        <PrimaryButton label="Bottom sheet (@gorhom)" onPress={openSheet} />
        <PrimaryButton label="Paper Dialog (Portal)" onPress={() => setPaperVisible(true)} />

        <Text style={styles.heading}>Transient</Text>
        <PrimaryButton
          label="Snackbar (in-tree)"
          variant="secondary"
          onPress={() => setSnackbarVisible(true)}
        />

        {isIOS ? (
          <>
            <Text style={styles.heading}>Special windows</Text>
            <PrimaryButton
              label="FullWindowOverlay"
              variant="secondary"
              onPress={() => setOverlayVisible(true)}
            />
            <PrimaryButton
              label="Banner window: show"
              variant="secondary"
              onPress={showBannerWindow}
            />
            <PrimaryButton
              label="Banner window: hide"
              variant="secondary"
              onPress={hideBannerWindow}
            />
          </>
        ) : null}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalRoot,
            { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <Text style={styles.modalTitle}>Native modal</Text>
          <Text style={styles.modalBody}>
            This is the native React Native Modal component, rendered above the whole app. Close it
            with the button below{isIOS ? '.' : ' or the system back gesture.'}
          </Text>

          <View style={styles.spacer} />

          <PrimaryButton label="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* backdropTransitionOutTiming={1} works around a react-native-modal backdrop
          flicker on close; the documented {0} is treated as falsy and ignored. */}
      <RNModal
        isVisible={rnModalVisible}
        backdropTransitionOutTiming={1}
        onBackdropPress={() => setRnModalVisible(false)}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>react-native-modal (raw)</Text>
          <Text style={styles.cardBody}>Built on the native RN Modal.</Text>
          <PrimaryButton label="Close" onPress={() => setRnModalVisible(false)} />
        </View>
      </RNModal>

      <Portal>
        <Dialog visible={paperVisible} onDismiss={() => setPaperVisible(false)}>
          <Dialog.Title>Paper Dialog</Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">Rendered via a react-native-paper Portal.</PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setPaperVisible(false)}>OK</PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
      >
        An in-tree Snackbar
      </Snackbar>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['45%', '80%']}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Actions</Text>
          {SHEET_ACTIONS.map((action) => (
            <Pressable key={action} style={styles.action} onPress={closeSheet}>
              <Text style={styles.actionText}>{action}</Text>
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheet>

      {isIOS && overlayVisible ? (
        <FullWindowOverlay>
          <View style={styles.fwo}>
            <Text style={styles.fwoText}>FullWindowOverlay — above everything</Text>
            <PrimaryButton label="Close" onPress={() => setOverlayVisible(false)} />
          </View>
        </FullWindowOverlay>
      ) : null}
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
  // Not the `flex` style above — that one carries the screen background color and
  // painted a visible rectangle inside the modal.
  spacer: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  modalTitle: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalBody: {
    fontSize: font.size.body,
    lineHeight: 22,
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
  },
  cardBody: {
    fontSize: font.size.md,
    color: colors.textMuted,
  },
  sheetBackground: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  handle: {
    backgroundColor: colors.handle,
    width: 44,
  },
  sheetContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  action: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  actionText: {
    fontSize: font.size.lg,
    color: colors.text,
  },
  fwo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  fwoText: {
    color: colors.surface,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    textAlign: 'center',
  },
});
