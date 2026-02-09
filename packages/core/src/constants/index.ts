export const APP_NAME = 'Hanzo Studio'
export const DEFAULT_SERVER_URL = 'http://127.0.0.1:8188'
export const DEFAULT_CLIENT_ID = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)

/** Slot type to color mapping for graph edges */
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

/** Default node dimensions */
export const DEFAULT_NODE_WIDTH = 210
export const DEFAULT_NODE_HEIGHT = 60
export const NODE_TITLE_HEIGHT = 30
export const NODE_SLOT_HEIGHT = 20
export const NODE_WIDGET_HEIGHT = 26
