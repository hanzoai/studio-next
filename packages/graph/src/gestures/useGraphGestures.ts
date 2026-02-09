/**
 * Unified gesture handling for the graph canvas.
 * Works with both mouse (web) and touch (mobile) via
 * react-native-gesture-handler's GestureDetector.
 */
import { useCallback, useRef } from 'react'
import type { Camera, SelectionState, GraphNode } from '../engine/types'

export interface GestureCallbacks {
  onPan: (dx: number, dy: number) => void
  onZoom: (scale: number, focalX: number, focalY: number) => void
  onNodeDragStart: (nodeId: number) => void
  onNodeDrag: (nodeId: number, x: number, y: number) => void
  onNodeDragEnd: (nodeId: number) => void
  onNodeTap: (nodeId: number) => void
  onSlotTap: (nodeId: number, slotIndex: number, isOutput: boolean) => void
  onCanvasTap: (x: number, y: number) => void
  onLassoStart: (x: number, y: number) => void
  onLassoMove: (x: number, y: number) => void
  onLassoEnd: () => void
}

/** Convert screen coordinates to graph coordinates */
export function screenToGraph(
  screenX: number,
  screenY: number,
  camera: Camera
): [number, number] {
  return [
    (screenX - camera.x) / camera.scale,
    (screenY - camera.y) / camera.scale,
  ]
}

/** Convert graph coordinates to screen coordinates */
export function graphToScreen(
  graphX: number,
  graphY: number,
  camera: Camera
): [number, number] {
  return [
    graphX * camera.scale + camera.x,
    graphY * camera.scale + camera.y,
  ]
}

/** Hit-test: find node at graph position */
export function hitTestNode(
  nodes: Map<number, GraphNode>,
  gx: number,
  gy: number
): GraphNode | null {
  // Iterate in reverse to hit top-most node first
  const nodeList = [...nodes.values()].reverse()
  for (const node of nodeList) {
    const [nx, ny] = node.pos
    const [nw, nh] = node.size
    if (gx >= nx && gx <= nx + nw && gy >= ny && gy <= ny + nh) {
      return node
    }
  }
  return null
}

/** Hit-test: find slot at graph position */
export function hitTestSlot(
  node: GraphNode,
  gx: number,
  gy: number
): { index: number; isOutput: boolean } | null {
  const TITLE_H = 30
  const SLOT_H = 20
  const HIT_RADIUS = 10
  const [nx, ny] = node.pos
  const [nw] = node.size

  // Check inputs (left side)
  for (let i = 0; i < node.inputs.length; i++) {
    const sy = ny + TITLE_H + 10 + i * SLOT_H
    const dist = Math.hypot(gx - nx, gy - sy)
    if (dist <= HIT_RADIUS) return { index: i, isOutput: false }
  }

  // Check outputs (right side)
  for (let i = 0; i < node.outputs.length; i++) {
    const sy = ny + TITLE_H + 10 + i * SLOT_H
    const dist = Math.hypot(gx - (nx + nw), gy - sy)
    if (dist <= HIT_RADIUS) return { index: i, isOutput: true }
  }

  return null
}

/** Camera state hook */
export function useCamera(initial?: Partial<Camera>) {
  const camera = useRef<Camera>({
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
    scale: initial?.scale ?? 1,
  })

  const pan = useCallback((dx: number, dy: number) => {
    camera.current.x += dx
    camera.current.y += dy
  }, [])

  const zoom = useCallback((factor: number, focalX: number, focalY: number) => {
    const prev = camera.current.scale
    const next = Math.max(0.1, Math.min(5, prev * factor))
    // Zoom towards focal point
    camera.current.x = focalX - (focalX - camera.current.x) * (next / prev)
    camera.current.y = focalY - (focalY - camera.current.y) * (next / prev)
    camera.current.scale = next
  }, [])

  return { camera, pan, zoom }
}
