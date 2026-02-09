/**
 * Studio color palette.
 * Dark-first design (Studio is primarily dark-themed).
 */

export const colorsDark = {
  // Brand
  primary: '#fd4444',
  primaryLight: '#ff6b6b',
  primaryDark: '#cc3333',
  accent1: '#fd4444',
  accent1Hovered: '#ff6b6b',
  accent2: '#2196f3',
  accent2Hovered: '#42a5f5',

  // Surfaces
  surface1: '#171717',
  surface1Hovered: '#1a1a1a',
  surface2: '#1f1f1f',
  surface2Hovered: '#252525',
  surface3: '#2a2a2a',
  surface3Hovered: '#303030',
  surface4: '#353535',

  // Text
  neutral1: '#ffffff',
  neutral2: 'rgba(255,255,255,0.65)',
  neutral3: 'rgba(255,255,255,0.38)',
  neutral4: 'rgba(255,255,255,0.16)',

  // Status
  statusSuccess: '#21C95E',
  statusSuccessHovered: '#2ae06b',
  statusWarning: '#FFBF17',
  statusWarningHovered: '#ffc940',
  statusCritical: '#FF593C',
  statusCriticalHovered: '#ff7660',

  // Graph slot colors
  slotImage: '#64b5f6',
  slotLatent: '#ff80ab',
  slotModel: '#b39ddb',
  slotClip: '#ffcc02',
  slotVae: '#ff6e6e',
  slotConditioning: '#ffa726',
  slotMask: '#81c784',
  slotNumber: '#a8d8b9',
  slotString: '#a1a1a1',

  // Utility
  none: 'transparent',
  scrim: 'rgba(0,0,0,0.6)',
}

export const colorsLight = {
  // Brand
  primary: '#e53935',
  primaryLight: '#ef5350',
  primaryDark: '#c62828',
  accent1: '#e53935',
  accent1Hovered: '#ef5350',
  accent2: '#1976d2',
  accent2Hovered: '#1e88e5',

  // Surfaces
  surface1: '#ffffff',
  surface1Hovered: '#f5f5f5',
  surface2: '#f5f5f5',
  surface2Hovered: '#eeeeee',
  surface3: '#eeeeee',
  surface3Hovered: '#e0e0e0',
  surface4: '#e0e0e0',

  // Text
  neutral1: '#1a1a1a',
  neutral2: 'rgba(0,0,0,0.65)',
  neutral3: 'rgba(0,0,0,0.38)',
  neutral4: 'rgba(0,0,0,0.12)',

  // Status
  statusSuccess: '#1b9e4b',
  statusSuccessHovered: '#21b859',
  statusWarning: '#e5a800',
  statusWarningHovered: '#f0b800',
  statusCritical: '#e53935',
  statusCriticalHovered: '#ef5350',

  // Graph slot colors (same for both themes)
  slotImage: '#64b5f6',
  slotLatent: '#ff80ab',
  slotModel: '#b39ddb',
  slotClip: '#ffcc02',
  slotVae: '#ff6e6e',
  slotConditioning: '#ffa726',
  slotMask: '#81c784',
  slotNumber: '#a8d8b9',
  slotString: '#666666',

  // Utility
  none: 'transparent',
  scrim: 'rgba(0,0,0,0.3)',
}

export const colors = { ...colorsDark, ...colorsLight }
