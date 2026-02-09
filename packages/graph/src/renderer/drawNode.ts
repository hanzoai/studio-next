/**
 * Skia draw functions for graph nodes.
 * These are pure drawing functions that take a Skia canvas and node data.
 */
import type { SkCanvas, SkPaint, SkFont } from '@shopify/react-native-skia'
import type { GraphNode } from '../engine/types'
import {
  TITLE_HEIGHT,
  SLOT_HEIGHT,
  SLOT_RADIUS,
  WIDGET_HEIGHT,
  NODE_BORDER_RADIUS,
  getCategoryColor,
  getSlotColor,
} from './constants'

interface DrawContext {
  canvas: SkCanvas
  nodePaint: SkPaint
  titlePaint: SkPaint
  textPaint: SkPaint
  slotPaint: SkPaint
  font: SkFont
  smallFont: SkFont
  selectedNodes: Set<number>
}

export function drawNode(ctx: DrawContext, node: GraphNode): void {
  const { canvas, nodePaint, titlePaint, textPaint, slotPaint, font, smallFont, selectedNodes } = ctx
  const [x, y] = node.pos
  const [w, h] = node.size

  // Node body
  const bgColor = node.bgColor ?? getCategoryColor(node.type.split('.')[0] ?? '')
  nodePaint.setColor(Skia.Color(bgColor))
  const rrect = Skia.RRectXY(Skia.XYWHRect(x, y, w, h), NODE_BORDER_RADIUS, NODE_BORDER_RADIUS)
  canvas.drawRRect(rrect, nodePaint)

  // Title bar
  const titleColor = node.color ?? '#555555'
  titlePaint.setColor(Skia.Color(titleColor))
  const titleRRect = Skia.RRectXY(
    Skia.XYWHRect(x, y, w, TITLE_HEIGHT),
    NODE_BORDER_RADIUS,
    NODE_BORDER_RADIUS
  )
  canvas.drawRRect(titleRRect, titlePaint)
  // Fill bottom corners of title bar
  canvas.drawRect(Skia.XYWHRect(x, y + TITLE_HEIGHT - NODE_BORDER_RADIUS, w, NODE_BORDER_RADIUS), titlePaint)

  // Title text
  textPaint.setColor(Skia.Color('#ffffff'))
  canvas.drawText(node.title, x + 10, y + 20, font, textPaint)

  // Selection highlight
  if (selectedNodes.has(node.id)) {
    const selPaint = Skia.Paint()
    selPaint.setColor(Skia.Color('#64b5f6'))
    selPaint.setStyle(1) // Stroke
    selPaint.setStrokeWidth(2)
    canvas.drawRRect(rrect, selPaint)
  }

  // Input slots
  let slotY = y + TITLE_HEIGHT + 10
  for (const input of node.inputs) {
    const color = getSlotColor(input.type)
    slotPaint.setColor(Skia.Color(color))
    canvas.drawCircle(x, slotY, SLOT_RADIUS, slotPaint)

    textPaint.setColor(Skia.Color('rgba(255,255,255,0.8)'))
    canvas.drawText(input.name, x + 12, slotY + 4, smallFont, textPaint)

    slotY += SLOT_HEIGHT
  }

  // Output slots
  slotY = y + TITLE_HEIGHT + 10
  for (const output of node.outputs) {
    const color = getSlotColor(output.type)
    slotPaint.setColor(Skia.Color(color))
    canvas.drawCircle(x + w, slotY, SLOT_RADIUS, slotPaint)

    const textWidth = smallFont.measureText(output.name).width
    textPaint.setColor(Skia.Color('rgba(255,255,255,0.8)'))
    canvas.drawText(output.name, x + w - textWidth - 12, slotY + 4, smallFont, textPaint)

    slotY += SLOT_HEIGHT
  }

  // Widgets area (below slots)
  const widgetStartY = y + TITLE_HEIGHT + 10 + Math.max(node.inputs.length, node.outputs.length) * SLOT_HEIGHT
  let widgetY = widgetStartY
  for (const widget of node.widgets) {
    drawWidget(ctx, node, widget, x + 10, widgetY, w - 20)
    widgetY += WIDGET_HEIGHT
  }
}

function drawWidget(
  ctx: DrawContext,
  _node: GraphNode,
  widget: GraphWidget,
  x: number,
  y: number,
  width: number,
): void {
  const { canvas, nodePaint, textPaint, smallFont } = ctx

  // Widget background
  nodePaint.setColor(Skia.Color('rgba(0,0,0,0.3)'))
  const wrect = Skia.RRectXY(Skia.XYWHRect(x, y, width, WIDGET_HEIGHT - 4), 4, 4)
  canvas.drawRRect(wrect, nodePaint)

  // Widget label + value
  textPaint.setColor(Skia.Color('rgba(255,255,255,0.6)'))
  canvas.drawText(widget.name, x + 6, y + 16, smallFont, textPaint)

  const valueStr = String(widget.value ?? '')
  const valueWidth = smallFont.measureText(valueStr).width
  textPaint.setColor(Skia.Color('rgba(255,255,255,0.9)'))
  canvas.drawText(valueStr, x + width - valueWidth - 6, y + 16, smallFont, textPaint)

  // Slider fill for numeric widgets
  if (widget.type === 'slider' && widget.options) {
    const min = widget.options.min ?? 0
    const max = widget.options.max ?? 1
    const val = Number(widget.value ?? 0)
    const pct = Math.max(0, Math.min(1, (val - min) / (max - min)))

    nodePaint.setColor(Skia.Color('rgba(100,181,246,0.3)'))
    canvas.drawRRect(
      Skia.RRectXY(Skia.XYWHRect(x, y, width * pct, WIDGET_HEIGHT - 4), 4, 4),
      nodePaint
    )
  }
}

// Skia global needed for Color/Paint/etc factory methods.
// This will be provided by @shopify/react-native-skia runtime.
declare const Skia: typeof import('@shopify/react-native-skia').Skia

import type { GraphWidget } from '../engine/types'
