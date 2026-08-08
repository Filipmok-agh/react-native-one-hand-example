/* eslint-disable react-hooks/immutability -- Reanimated shared values are mutable by design */
import { memo, useEffect } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { isIOS } from '@/constants/platform';
import type { ListItem } from '@/constants/listData';
import { colors, font, radius, ROW_HEIGHT, spacing } from '@/constants/theme';

type ListRowProps = {
  item: ListItem;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

function ListRowComponent({ item, expanded, onToggle, onDelete }: ListRowProps) {
  const { width } = useWindowDimensions();
  const deleteThreshold = width * 0.35;
  const translateX = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const collapseHeight = useSharedValue(0);
  const collapsing = useSharedValue(0);

  // FlashList recycles row components — reset drag state when the item changes.
  useEffect(() => {
    translateX.value = 0;
    collapsing.value = 0;
  }, [item.id, translateX, collapsing]);

  const pan = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd(() => {
      if (translateX.value < -deleteThreshold) {
        collapseHeight.value = measuredHeight.value;
        collapsing.value = 1;
        translateX.value = withTiming(-width, { duration: 160 });
        collapseHeight.value = withDelay(
          140,
          withTiming(0, { duration: 200 }, (finished) => {
            if (finished) runOnJS(onDelete)();
          }),
        );
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const rowStyle = useAnimatedStyle(() => {
    const progress = interpolate(-translateX.value, [0, deleteThreshold], [0, 1], 'clamp');
    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${-4 * progress}deg` },
        { scale: 1 - 0.04 * progress },
      ],
    };
  });

  const underlayStyle = useAnimatedStyle(() => {
    const progress = interpolate(-translateX.value, [0, deleteThreshold], [0, 1], 'clamp');
    return {
      opacity: interpolate(-translateX.value, [0, 48], [0, 1], 'clamp'),
      transform: [{ scale: 0.9 + 0.1 * progress }],
    };
  });

  const showRowMenu = () => {
    if (isIOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: item.title,
          options: ['Cancel', expanded ? 'Collapse' : 'Expand', 'Delete'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        (index) => {
          if (index === 1) onToggle();
          if (index === 2) onDelete();
        },
      );
    } else {
      Alert.alert(item.title, item.subtitle, [
        { text: 'Cancel', style: 'cancel' },
        { text: expanded ? 'Collapse' : 'Expand', onPress: onToggle },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]);
    }
  };

  const containerStyle = useAnimatedStyle(() =>
    collapsing.value ? { height: collapseHeight.value, overflow: 'hidden' as const } : {},
  );

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      onLayout={(event) => {
        if (!collapsing.value) measuredHeight.value = event.nativeEvent.layout.height;
      }}
    >
      <View style={styles.underlay}>
        <Animated.Text style={[styles.underlayText, underlayStyle]}>Delete</Animated.Text>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.rowWrap, rowStyle]}>
          <Pressable onPress={onToggle} onLongPress={showRowMenu}>
            <View style={styles.row}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.id}</Text>
              </View>
              <View style={styles.texts}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
            </View>
            {expanded ? <Text style={styles.details}>{item.details}</Text> : null}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export const ListRow = memo(ListRowComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
  },
  underlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.lg,
  },
  underlayText: {
    color: colors.primaryText,
    fontWeight: font.weight.bold,
    fontSize: font.size.body,
  },
  rowWrap: {
    backgroundColor: colors.surface,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: font.weight.bold,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: font.size.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: font.size.md,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  details: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    fontSize: font.size.sm,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
