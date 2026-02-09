/** Visual constants for graph rendering */

export const TITLE_HEIGHT = 30
export const SLOT_HEIGHT = 20
export const SLOT_RADIUS = 5
export const WIDGET_HEIGHT = 26
export const NODE_BORDER_RADIUS = 8
export const NODE_MIN_WIDTH = 210
export const LINK_THICKNESS = 2.5
export const LINK_CURVATURE = 0.4
export const GRID_SIZE = 20
export const GRID_COLOR = 'rgba(255,255,255,0.03)'
export const GRID_MAJOR_EVERY = 5
export const GRID_MAJOR_COLOR = 'rgba(255,255,255,0.06)'
export const SELECTION_COLOR = '#64b5f6'
export const SELECTION_ALPHA = 0.2

/** Default node colors by category */
export const CATEGORY_COLORS: Record<string, string> = {
  loaders: '#523e73',
  conditioning: '#3e5573',
  latent: '#533e73',
  image: '#3e5c73',
  sampling: '#4a5e3e',
  advanced: '#5e3e3e',
  _default: '#3a3a3a',
}

/** Slot type colors */
export const SLOT_COLORS: Record<string, string> = {
  IMAGE: '#64b5f6',
  LATENT: '#ff80ab',
  MODEL: '#b39ddb',
  CLIP: '#ffcc02',
  VAE: '#ff6e6e',
  CONDITIONING: '#ffa726',
  MASK: '#81c784',
  INT: '#a8d8b9',
  FLOAT: '#a8d8b9',
  STRING: '#a1a1a1',
  BOOLEAN: '#a1a1a1',
  '*': '#a1a1a1',
}

export function getSlotColor(type: string): string {
  return SLOT_COLORS[type] ?? SLOT_COLORS['*']
}

export function getCategoryColor(category: string): string {
  // Take first segment of category path
  const base = category.split('/')[0]?.toLowerCase() ?? ''
  return CATEGORY_COLORS[base] ?? CATEGORY_COLORS._default
}
