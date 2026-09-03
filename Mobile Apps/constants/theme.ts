import { Platform } from 'react-native';

export const Brand = {
  navy:       '#000F3E',
  navy2:      '#00174D',
  blue:       '#0050F5',
  blue2:      '#1A6BFF',
  blue4:      '#669DFF',
  lightBlue:  '#EAF1FF',
  lightBlue2: '#DDE7FF',
  bg:         '#FFFFFF',
  bg2:        '#F5F7FF',
  bg3:        '#EEF1FA',
  bg4:        '#E8ECF8',
  bg5:        '#DDE2EE',
  success:    '#16A34A',
  warning:    '#D97706',
  danger:     '#DC2626',
}

export const Colors = {
  light: {
    text:            Brand.navy,
    background:      Brand.bg,
    tint:            Brand.blue,
    icon:            Brand.navy,
    tabIconDefault:  Brand.bg5,
    tabIconSelected: Brand.blue,
  },
  dark: {
    text:            '#ECEDEE',
    background:      '#151718',
    tint:            '#fff',
    icon:            '#9BA1A6',
    tabIconDefault:  '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
