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

// xyflow adapter
export {
  graphToFlow,
  toFlowNode,
  toFlowEdge,
  applyNodePosition,
  getSlotColor,
  getCategoryColor,
  type StudioNodeData,
} from './adapter'

// React components
export { GraphCanvas, type GraphCanvasProps } from './GraphCanvas'
export { StudioNode } from './nodes/StudioNode'
export { StudioEdge } from './edges/StudioEdge'
