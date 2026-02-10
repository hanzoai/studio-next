/**
 * Adapter: converts between our Graph engine types and @xyflow/react types.
 */
import type { Node, Edge, XYPosition } from '@xyflow/react'
import type { Graph } from './engine/graph'
import type { GraphNode, GraphLink } from './engine/types'

/** Slot type → edge color */
const SLOT_COLORS: Record<string, string> = {
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

/** Category → node header color */
const CATEGORY_COLORS: Record<string, string> = {
  loaders: '#523e73',
  conditioning: '#3e5573',
  latent: '#533e73',
  image: '#3e5c73',
  sampling: '#4a5e3e',
  advanced: '#5e3e3e',
  _default: '#3a3a3a',
}

export function getCategoryColor(type: string): string {
  const base = type.split('.')[0]?.toLowerCase() ?? ''
  return CATEGORY_COLORS[base] ?? CATEGORY_COLORS._default
}

export type StudioNodeData = {
  label: string
  type: string
  inputs: { name: string; type: string; linked: boolean }[]
  outputs: { name: string; type: string; linkCount: number }[]
  widgets: { name: string; type: string; value: unknown; options?: Record<string, unknown> }[]
  color?: string
  bgColor?: string
  [key: string]: unknown
}

/** Convert our GraphNode → xyflow Node */
export function toFlowNode(node: GraphNode): Node<StudioNodeData> {
  return {
    id: String(node.id),
    type: 'studio',
    position: { x: node.pos[0], y: node.pos[1] },
    data: {
      label: node.title,
      type: node.type,
      inputs: node.inputs.map((s) => ({
        name: s.name,
        type: s.type,
        linked: s.link !== null,
      })),
      outputs: node.outputs.map((s) => ({
        name: s.name,
        type: s.type,
        linkCount: s.links?.length ?? 0,
      })),
      widgets: node.widgets.map((w) => ({
        name: w.name,
        type: w.type,
        value: w.value,
        options: w.options,
      })),
      color: node.color,
      bgColor: node.bgColor,
    },
  }
}

/** Convert our GraphLink → xyflow Edge */
export function toFlowEdge(link: GraphLink): Edge {
  return {
    id: String(link.id),
    source: String(link.originId),
    sourceHandle: `output-${link.originSlot}`,
    target: String(link.targetId),
    targetHandle: `input-${link.targetSlot}`,
    type: 'studio',
    style: { stroke: getSlotColor(link.type), strokeWidth: 2.5 },
    data: { slotType: link.type },
  }
}

/** Convert full Graph → xyflow nodes + edges */
export function graphToFlow(graph: Graph): { nodes: Node<StudioNodeData>[]; edges: Edge[] } {
  const nodes = [...graph.nodes.values()].map(toFlowNode)
  const edges = [...graph.links.values()].map(toFlowEdge)
  return { nodes, edges }
}

/** Apply xyflow position changes back to our Graph */
export function applyNodePosition(graph: Graph, nodeId: string, position: XYPosition): void {
  const node = graph.getNode(Number(nodeId))
  if (node) {
    node.pos = [position.x, position.y]
  }
}
