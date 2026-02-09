/**
 * GraphCanvas - Main graph editor React component.
 *
 * Uses @shopify/react-native-skia Canvas for hardware-accelerated rendering.
 * Works on both web and native (iOS/Android).
 */
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Canvas,
  useCanvasRef,
  useTouchHandler,
  Skia,
  useFont,
  type SkCanvas,
} from '@shopify/react-native-skia'
import { Graph } from './engine/graph'
import type { Camera, GraphNode } from './engine/types'
import { drawGrid } from './renderer/drawGrid'
import { drawNode } from './renderer/drawNode'
import { drawLink, drawTempLink } from './renderer/drawLink'
import { screenToGraph, hitTestNode, hitTestSlot, useCamera } from './gestures/useGraphGestures'

export interface GraphCanvasProps {
  graph: Graph
  width: number
  height: number
  onNodeSelect?: (nodeId: number | null) => void
  onNodeMoved?: (nodeId: number, pos: [number, number]) => void
  onLinkCreated?: (originId: number, originSlot: number, targetId: number, targetSlot: number) => void
}

export function GraphCanvas({
  graph,
  width,
  height,
  onNodeSelect,
  onNodeMoved,
  onLinkCreated,
}: GraphCanvasProps) {
  const canvasRef = useCanvasRef()
  const { camera, pan, zoom } = useCamera()

  const [selectedNodes, setSelectedNodes] = useState<Set<number>>(new Set())
  const [dragging, setDragging] = useState<{ nodeId: number; offset: [number, number] } | null>(null)
  const [connecting, setConnecting] = useState<{
    nodeId: number
    slotIndex: number
    isOutput: boolean
    mousePos: [number, number]
  } | null>(null)

  // Track gesture state
  const lastTouchRef = useRef<[number, number] | null>(null)
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null)

  const font = useFont(null, 13)
  const smallFont = useFont(null, 11)

  const touchHandler = useTouchHandler({
    onStart: (touchInfo) => {
      const { x: sx, y: sy } = touchInfo
      const [gx, gy] = screenToGraph(sx, sy, camera.current)

      lastTouchRef.current = [sx, sy]

      // Hit test nodes
      const hitNode = hitTestNode(graph.nodes, gx, gy)
      if (hitNode) {
        // Check slot hit first
        const slot = hitTestSlot(hitNode, gx, gy)
        if (slot) {
          setConnecting({
            nodeId: hitNode.id,
            slotIndex: slot.index,
            isOutput: slot.isOutput,
            mousePos: [gx, gy],
          })
          return
        }

        // Node drag
        setDragging({
          nodeId: hitNode.id,
          offset: [gx - hitNode.pos[0], gy - hitNode.pos[1]],
        })
        setSelectedNodes(new Set([hitNode.id]))
        onNodeSelect?.(hitNode.id)
      } else {
        setSelectedNodes(new Set())
        onNodeSelect?.(null)
      }
    },

    onActive: (touchInfo) => {
      const { x: sx, y: sy } = touchInfo
      const [gx, gy] = screenToGraph(sx, sy, camera.current)

      if (dragging) {
        const node = graph.getNode(dragging.nodeId)
        if (node) {
          node.pos = [gx - dragging.offset[0], gy - dragging.offset[1]]
        }
      } else if (connecting) {
        setConnecting((prev) => prev ? { ...prev, mousePos: [gx, gy] } : null)
      } else if (lastTouchRef.current) {
        // Pan
        pan(sx - lastTouchRef.current[0], sy - lastTouchRef.current[1])
        lastTouchRef.current = [sx, sy]
      }
    },

    onEnd: (touchInfo) => {
      if (dragging) {
        const node = graph.getNode(dragging.nodeId)
        if (node) onNodeMoved?.(dragging.nodeId, node.pos)
        setDragging(null)
      }

      if (connecting) {
        const { x: sx, y: sy } = touchInfo
        const [gx, gy] = screenToGraph(sx, sy, camera.current)
        const hitNode = hitTestNode(graph.nodes, gx, gy)

        if (hitNode && hitNode.id !== connecting.nodeId) {
          const slot = hitTestSlot(hitNode, gx, gy)
          if (slot && slot.isOutput !== connecting.isOutput) {
            if (connecting.isOutput) {
              onLinkCreated?.(connecting.nodeId, connecting.slotIndex, hitNode.id, slot.index)
            } else {
              onLinkCreated?.(hitNode.id, slot.index, connecting.nodeId, connecting.slotIndex)
            }
          }
        }
        setConnecting(null)
      }

      lastTouchRef.current = null
    },
  })

  const onDraw = useCallback(
    (canvas: SkCanvas) => {
      if (!font || !smallFont) return

      const cam = camera.current

      // Clear
      canvas.clear(Skia.Color('#171717'))

      // Grid (in screen space)
      const gridPaint = Skia.Paint()
      drawGrid(canvas, gridPaint, cam, width, height)

      // Apply camera transform
      canvas.save()
      canvas.translate(cam.x, cam.y)
      canvas.scale(cam.scale, cam.scale)

      // Links
      const linkPaint = Skia.Paint()
      for (const link of graph.links.values()) {
        const origin = graph.getNode(link.originId)
        const target = graph.getNode(link.targetId)
        if (origin && target) {
          drawLink(canvas, linkPaint, link, origin, target)
        }
      }

      // Temp connecting link
      if (connecting) {
        const connectNode = graph.getNode(connecting.nodeId)
        if (connectNode) {
          const type = connecting.isOutput
            ? connectNode.outputs[connecting.slotIndex]?.type ?? '*'
            : connectNode.inputs[connecting.slotIndex]?.type ?? '*'
          drawTempLink(
            canvas, linkPaint, connectNode,
            connecting.slotIndex, connecting.isOutput,
            connecting.mousePos[0], connecting.mousePos[1], type
          )
        }
      }

      // Nodes
      const nodePaint = Skia.Paint()
      const titlePaint = Skia.Paint()
      const textPaint = Skia.Paint()
      const slotPaint = Skia.Paint()

      for (const node of graph.nodes.values()) {
        drawNode({
          canvas,
          nodePaint,
          titlePaint,
          textPaint,
          slotPaint,
          font,
          smallFont,
          selectedNodes,
        }, node)
      }

      canvas.restore()
    },
    [graph, font, smallFont, width, height, selectedNodes, connecting, camera]
  )

  return (
    <Canvas
      ref={canvasRef}
      style={{ width, height }}
      onTouch={touchHandler}
      onDraw={onDraw}
    />
  )
}

GraphCanvas.displayName = 'GraphCanvas'
