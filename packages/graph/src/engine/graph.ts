import type {
  GraphData,
  GraphLink,
  GraphNode,
  GraphSlot,
  GraphWidget,
  GraphGroup,
} from './types'

/**
 * Pure graph data model. No rendering, no framework deps.
 * Handles node/link CRUD, serialization, and execution ordering.
 */
export class Graph {
  nodes: Map<number, GraphNode> = new Map()
  links: Map<number, GraphLink> = new Map()
  groups: GraphGroup[] = []
  private nextNodeId = 1
  private nextLinkId = 1

  // -- Node CRUD --

  addNode(type: string, title: string, pos: [number, number], config?: {
    size?: [number, number]
    inputs?: GraphSlot[]
    outputs?: GraphSlot[]
    widgets?: GraphWidget[]
    color?: string
    bgColor?: string
    properties?: Record<string, unknown>
  }): GraphNode {
    const node: GraphNode = {
      id: this.nextNodeId++,
      type,
      title,
      pos,
      size: config?.size ?? [210, 60],
      color: config?.color,
      bgColor: config?.bgColor,
      inputs: config?.inputs ?? [],
      outputs: config?.outputs ?? [],
      widgets: config?.widgets ?? [],
      properties: config?.properties ?? {},
      flags: {},
    }
    this.nodes.set(node.id, node)
    this.recalcNodeSize(node)
    return node
  }

  removeNode(id: number): void {
    // Remove all links connected to this node
    for (const [linkId, link] of this.links) {
      if (link.originId === id || link.targetId === id) {
        this.removeLink(linkId)
      }
    }
    this.nodes.delete(id)
  }

  moveNode(id: number, pos: [number, number]): void {
    const node = this.nodes.get(id)
    if (node) node.pos = pos
  }

  // -- Link CRUD --

  addLink(
    originId: number,
    originSlot: number,
    targetId: number,
    targetSlot: number,
    type: string
  ): GraphLink | null {
    const origin = this.nodes.get(originId)
    const target = this.nodes.get(targetId)
    if (!origin || !target) return null
    if (!origin.outputs[originSlot] || !target.inputs[targetSlot]) return null

    // Remove existing link on the target input
    const existing = target.inputs[targetSlot].link
    if (existing !== null) this.removeLink(existing)

    const link: GraphLink = {
      id: this.nextLinkId++,
      originId,
      originSlot,
      targetId,
      targetSlot,
      type,
    }

    this.links.set(link.id, link)
    target.inputs[targetSlot].link = link.id
    const outLinks = origin.outputs[originSlot].links ?? []
    origin.outputs[originSlot].links = [...outLinks, link.id]

    return link
  }

  removeLink(id: number): void {
    const link = this.links.get(id)
    if (!link) return

    const origin = this.nodes.get(link.originId)
    if (origin?.outputs[link.originSlot]) {
      const outLinks = origin.outputs[link.originSlot].links ?? []
      origin.outputs[link.originSlot].links = outLinks.filter((l) => l !== id)
    }

    const target = this.nodes.get(link.targetId)
    if (target?.inputs[link.targetSlot]) {
      if (target.inputs[link.targetSlot].link === id) {
        target.inputs[link.targetSlot].link = null
      }
    }

    this.links.delete(id)
  }

  // -- Size calculation --

  private recalcNodeSize(node: GraphNode): void {
    const TITLE_H = 30
    const SLOT_H = 20
    const WIDGET_H = 26
    const PADDING = 6

    const slotCount = Math.max(node.inputs.length, node.outputs.length)
    const widgetCount = node.widgets.length
    const height = TITLE_H + slotCount * SLOT_H + widgetCount * WIDGET_H + PADDING
    node.size = [Math.max(node.size[0], 210), Math.max(height, 60)]
  }

  // -- Execution order (topological sort) --

  getExecutionOrder(): GraphNode[] {
    const visited = new Set<number>()
    const result: GraphNode[] = []

    const visit = (nodeId: number) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const node = this.nodes.get(nodeId)
      if (!node) return

      // Visit all upstream nodes first
      for (const input of node.inputs) {
        if (input.link !== null) {
          const link = this.links.get(input.link)
          if (link) visit(link.originId)
        }
      }

      result.push(node)
    }

    for (const [id] of this.nodes) {
      visit(id)
    }

    return result
  }

  // -- Serialization (litegraph-compatible) --

  serialize(): GraphData {
    return {
      nodes: [...this.nodes.values()],
      links: [...this.links.values()],
      groups: this.groups,
      lastNodeId: this.nextNodeId - 1,
      lastLinkId: this.nextLinkId - 1,
    }
  }

  static deserialize(data: GraphData): Graph {
    const graph = new Graph()
    graph.nextNodeId = data.lastNodeId + 1
    graph.nextLinkId = data.lastLinkId + 1
    graph.groups = data.groups ?? []

    for (const node of data.nodes) {
      graph.nodes.set(node.id, { ...node })
    }
    for (const link of data.links) {
      graph.links.set(link.id, { ...link })
    }

    return graph
  }

  // -- Convenience --

  getNode(id: number): GraphNode | undefined {
    return this.nodes.get(id)
  }

  getLink(id: number): GraphLink | undefined {
    return this.links.get(id)
  }

  getLinksForNode(nodeId: number): GraphLink[] {
    return [...this.links.values()].filter(
      (l) => l.originId === nodeId || l.targetId === nodeId
    )
  }

  clear(): void {
    this.nodes.clear()
    this.links.clear()
    this.groups = []
    this.nextNodeId = 1
    this.nextLinkId = 1
  }
}
