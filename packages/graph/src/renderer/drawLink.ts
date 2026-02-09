/**
 * Skia draw functions for graph edges/links.
 */
import type { SkCanvas, SkPaint } from '@shopify/react-native-skia'
import type { GraphLink, GraphNode } from '../engine/types'
import { TITLE_HEIGHT, SLOT_HEIGHT, LINK_THICKNESS, LINK_CURVATURE, getSlotColor } from './constants'

declare const Skia: typeof import('@shopify/react-native-skia').Skia

export function getSlotPosition(
  node: GraphNode,
  slotIndex: number,
  isOutput: boolean
): [number, number] {
  const [x, y] = node.pos
  const [w] = node.size
  const slotY = y + TITLE_HEIGHT + 10 + slotIndex * SLOT_HEIGHT
  return isOutput ? [x + w, slotY] : [x, slotY]
}

export function drawLink(
  canvas: SkCanvas,
  paint: SkPaint,
  link: GraphLink,
  originNode: GraphNode,
  targetNode: GraphNode,
): void {
  const [x1, y1] = getSlotPosition(originNode, link.originSlot, true)
  const [x2, y2] = getSlotPosition(targetNode, link.targetSlot, false)

  drawBezierLink(canvas, paint, x1, y1, x2, y2, link.type)
}

export function drawBezierLink(
  canvas: SkCanvas,
  paint: SkPaint,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
): void {
  const color = getSlotColor(type)
  paint.setColor(Skia.Color(color))
  paint.setStyle(1) // Stroke
  paint.setStrokeWidth(LINK_THICKNESS)
  paint.setAntiAlias(true)

  const dx = Math.abs(x2 - x1) * LINK_CURVATURE
  const path = Skia.Path.Make()
  path.moveTo(x1, y1)
  path.cubicTo(x1 + dx, y1, x2 - dx, y2, x2, y2)
  canvas.drawPath(path, paint)
}

export function drawTempLink(
  canvas: SkCanvas,
  paint: SkPaint,
  originNode: GraphNode,
  slotIndex: number,
  isOutput: boolean,
  mouseX: number,
  mouseY: number,
  type: string,
): void {
  const [sx, sy] = getSlotPosition(originNode, slotIndex, isOutput)
  if (isOutput) {
    drawBezierLink(canvas, paint, sx, sy, mouseX, mouseY, type)
  } else {
    drawBezierLink(canvas, paint, mouseX, mouseY, sx, sy, type)
  }
}
