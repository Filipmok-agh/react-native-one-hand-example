import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OneHandWindowsContainer } from 'react-native-one-hand';
import { colors, font } from '@/constants/theme';

// react-native-modal still calls the deprecated InteractionManager — silence exactly
// that one warning until the library updates.
if (__DEV__) {
  const warn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].startsWith('InteractionManager has been deprecated')
    ) {
      return;
    }
    warn(...args);
  };
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <OneHandWindowsContainer backdropColor={colors.backdrop} dismissHintColor={colors.text}>
          <PaperProvider>
            <BottomSheetModalProvider>
              <Tabs
                screenOptions={{
                  headerStyle: { backgroundColor: colors.chrome },
                  headerTitleStyle: { color: colors.chromeText, fontWeight: font.weight.heavy },
                  headerTitleAlign: 'center',
                  tabBarStyle: { backgroundColor: colors.chrome, borderTopColor: 'transparent' },
                  tabBarActiveTintColor: colors.chromeActive,
                  tabBarInactiveTintColor: colors.chromeInactive,
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: 'List',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="list-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="form"
                  options={{
                    title: 'Form',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="create-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="overlays"
                  options={{
                    title: 'Overlays',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="albums-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="widgets"
                  options={{
                    title: 'Widgets',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="apps-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="system"
                  options={{
                    title: 'System',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="camera-outline" color={color} size={size} />
                    ),
                  }}
                />
                <Tabs.Screen
                  name="rotate"
                  options={{
                    title: 'Rotate',
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name="phone-landscape-outline" color={color} size={size} />
                    ),
                  }}
                />
              </Tabs>
            </BottomSheetModalProvider>
          </PaperProvider>
        </OneHandWindowsContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
