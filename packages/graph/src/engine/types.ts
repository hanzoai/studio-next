/**
 * Core graph engine types - pure TypeScript, no UI framework dependencies.
 * These drive both the renderer and the execution engine.
 */

export interface GraphNode {
  id: number
  type: string
  title: string
  pos: [number, number]
  size: [number, number]
  color?: string
  bgColor?: string
  inputs: GraphSlot[]
  outputs: GraphSlot[]
  widgets: GraphWidget[]
  properties: Record<string, unknown>
  flags: Record<string, unknown>
  order?: number
  mode?: number
}

export interface GraphSlot {
  name: string
  type: string
  link: number | null    // for inputs: link ID or null
  links?: number[] | null // for outputs: array of link IDs
  color?: string
}

export interface GraphLink {
  id: number
  originId: number
  originSlot: number
  targetId: number
  targetSlot: number
  type: string
  color?: string
}

export interface GraphWidget {
  name: string
  type: 'number' | 'slider' | 'combo' | 'text' | 'toggle' | 'image' | 'color'
  value: unknown
  options?: {
    min?: number
    max?: number
    step?: number
    values?: string[]
    default?: unknown
    multiline?: boolean
  }
}

export interface GraphGroup {
  title: string
  bounding: [number, number, number, number] // x, y, w, h
  color?: string
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
  groups: GraphGroup[]
  lastNodeId: number
  lastLinkId: number
}

/** Camera/viewport state */
export interface Camera {
  x: number
  y: number
  scale: number
}

/** Selection state */
export interface SelectionState {
  nodes: Set<number>
  links: Set<number>
  dragging: boolean
  dragStart: [number, number] | null
  connecting: {
    nodeId: number
    slotIndex: number
    isOutput: boolean
    mousePos: [number, number]
  } | null
  lasso: {
    start: [number, number]
    end: [number, number]
  } | null
}
