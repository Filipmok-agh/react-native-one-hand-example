import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListRow } from '@/components/ListRow';
import { LIST_DATA } from '@/constants/listData';
import { colors, font, spacing } from '@/constants/theme';

export default function ListScreen() {
  const [items, setItems] = useState(LIST_DATA);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const toggle = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setItems(LIST_DATA);
      setExpandedId(null);
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.root}>
      <FlashList
        data={items}
        extraData={expandedId}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListRow
            item={item}
            expanded={item.id === expandedId}
            onToggle={() => toggle(item.id)}
            onDelete={() => remove(item.id)}
          />
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={Empty}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function Empty() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Everything deleted — pull down to refresh.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: font.size.md,
    color: colors.textMuted,
  },
});
