/** Shared design tokens — a very light, icy-blue identity. */
export const colors = {
  background: '#EDF5FC',
  surface: '#FFFFFF',
  border: '#D8E6F3',
  text: '#0F2A43',
  textMuted: '#5B7A96',
  primary: '#0284C7',
  primaryText: '#FFFFFF',
  primarySoft: '#DBEFFD',
  danger: '#DC2626',
  overlay: 'rgba(15, 42, 67, 0.45)',
  handle: '#C3D8EA',
  chrome: '#DCEEFB',
  chromeText: '#0F2A43',
  chromeActive: '#0284C7',
  chromeInactive: '#7FA3C0',
  backdrop: '#9FC1DC',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  md: 12,
  lg: 20,
} as const;

export const font = {
  size: {
    sm: 13,
    md: 14,
    body: 15,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
  weight: {
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
} as const;

export const ROW_HEIGHT = 64;
