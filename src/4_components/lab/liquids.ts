/** Liquid colours shared by every apparatus. All rgba so fills can transition smoothly. */
export const LIQUID = {
  clear: 'rgba(196, 224, 255, 0.40)',
  blue: 'rgba(30, 111, 224, 0.92)',
  green: 'rgba(61, 154, 74, 0.92)',
  orange: 'rgba(232, 137, 43, 0.92)',
  brick: 'rgba(166, 47, 26, 0.94)',
} as const;

export const GLASS = {
  stroke: 'rgba(255, 255, 255, 0.8)',
  fill: 'rgba(255, 255, 255, 0.05)',
  shine: 'rgba(255, 255, 255, 0.28)',
} as const;
