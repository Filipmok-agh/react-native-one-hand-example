export type ListItem = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
};

export const LIST_DATA: ListItem[] = Array.from({ length: 20 }, (_, index) => {
  const n = index + 1;
  return {
    id: String(n),
    title: `Item ${n}`,
    subtitle: `Description of item ${n}`,
    details:
      `Expanded details of item ${n}. Tap the row again to collapse it, drag it left past ` +
      'the threshold to delete it, long-press for a native menu, or pull down to refresh.',
  };
});
