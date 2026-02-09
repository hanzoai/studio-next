// Graph engine (pure TS - no UI deps)
export { Graph } from './engine/graph'
export type {
  GraphNode,
  GraphLink,
  GraphSlot,
  GraphWidget,
  GraphGroup,
  GraphData,
  Camera,
  SelectionState,
} from './engine/types'

// React Skia renderer
export { GraphCanvas, type GraphCanvasProps } from './GraphCanvas'

// Renderer utilities
export {
  getSlotColor,
  getCategoryColor,
  SLOT_COLORS,
  CATEGORY_COLORS,
} from './renderer/constants'

// Gesture utilities
export {
  screenToGraph,
  graphToScreen,
  hitTestNode,
  hitTestSlot,
  useCamera,
} from './gestures/useGraphGestures'
