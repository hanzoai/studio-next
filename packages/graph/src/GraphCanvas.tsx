/**
 * GraphCanvas - Main graph editor component built on @xyflow/react.
 *
 * Wraps ReactFlow with ComfyUI-style custom nodes and edges.
 * Works on web. For mobile, wrap in a WebView or use a simplified view.
 */
import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type NodeChange,
  type Node,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { Graph } from './engine/graph'
import { graphToFlow, applyNodePosition, type StudioNodeData } from './adapter'
import { StudioNode } from './nodes/StudioNode'
import { StudioEdge } from './edges/StudioEdge'

type StudioFlowNode = Node<StudioNodeData>

const nodeTypes = { studio: StudioNode } as const
const edgeTypes = { studio: StudioEdge } as const

export interface GraphCanvasProps {
  graph: Graph
  onNodeSelect?: (nodeId: number | null) => void
  onNodeMoved?: (nodeId: number, pos: [number, number]) => void
  onLinkCreated?: (originId: number, originSlot: number, targetId: number, targetSlot: number) => void
  onLinkDeleted?: (linkId: number) => void
}

export function GraphCanvas({
  graph,
  onNodeSelect,
  onNodeMoved,
  onLinkCreated,
}: GraphCanvasProps) {
  const initial = useMemo(() => graphToFlow(graph), [graph])
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)

  const handleNodesChange = useCallback(
    (changes: NodeChange<StudioFlowNode>[]) => {
      onNodesChange(changes)

      // Sync position changes back to engine
      for (const change of changes) {
        if (change.type === 'position' && change.position && !change.dragging) {
          applyNodePosition(graph, change.id, change.position)
          onNodeMoved?.(Number(change.id), [change.position.x, change.position.y])
        }
      }
    },
    [graph, onNodesChange, onNodeMoved]
  )

  const handleConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, type: 'studio' }, eds))

      // Parse handle IDs to get slot indices
      const originSlot = Number(params.sourceHandle?.replace('output-', '') ?? 0)
      const targetSlot = Number(params.targetHandle?.replace('input-', '') ?? 0)

      // Add to engine
      const originNode = graph.getNode(Number(params.source))
      const targetNode = graph.getNode(Number(params.target))
      if (originNode && targetNode) {
        const type = originNode.outputs[originSlot]?.type ?? '*'
        graph.addLink(Number(params.source), originSlot, Number(params.target), targetSlot, type)
        onLinkCreated?.(Number(params.source), originSlot, Number(params.target), targetSlot)
      }
    },
    [graph, setEdges, onLinkCreated]
  )

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: typeof nodes }) => {
      if (selectedNodes.length === 1) {
        onNodeSelect?.(Number(selectedNodes[0].id))
      } else if (selectedNodes.length === 0) {
        onNodeSelect?.(null)
      }
    },
    [onNodeSelect]
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        colorMode="dark"
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{ type: 'studio' }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={4}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.05)" />
        <Controls
          showInteractive={false}
          style={{ backgroundColor: '#1f1f1f', borderColor: '#2a2a2a' }}
        />
        <MiniMap
          style={{ backgroundColor: '#1f1f1f', border: '1px solid #2a2a2a' }}
          nodeColor={(n) => (n.data?.bgColor as string) ?? '#3a3a3a'}
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  )
}

GraphCanvas.displayName = 'GraphCanvas'
