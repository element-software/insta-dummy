// Design tokens – importable in TS for use outside Tailwind.
const colors = {
  brandPink: '#e1306c',
  brandBlue: '#0095f6',
  brandDark: '#00376b',
  divider: '#dbdbdb',
  bg: '#f9f9f9',
  text: '#262626',
  muted: '#8e8e8e',
  surface: '#efefef',
} as const;

export type Colors = typeof colors;

export default { colors };
