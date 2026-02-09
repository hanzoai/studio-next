/**
 * Background grid renderer.
 */
import type { SkCanvas, SkPaint } from '@shopify/react-native-skia'
import type { Camera } from '../engine/types'
import { GRID_SIZE, GRID_COLOR, GRID_MAJOR_EVERY, GRID_MAJOR_COLOR } from './constants'

declare const Skia: typeof import('@shopify/react-native-skia').Skia

export function drawGrid(
  canvas: SkCanvas,
  paint: SkPaint,
  camera: Camera,
  viewWidth: number,
  viewHeight: number,
): void {
  const { x: cx, y: cy, scale } = camera
  const gridSize = GRID_SIZE * scale

  // Don't draw grid if too zoomed out
  if (gridSize < 4) return

  const startX = (cx % gridSize) - gridSize
  const startY = (cy % gridSize) - gridSize

  // Minor grid
  paint.setColor(Skia.Color(GRID_COLOR))
  paint.setStrokeWidth(1)
  paint.setStyle(1)

  for (let x = startX; x < viewWidth + gridSize; x += gridSize) {
    canvas.drawLine(x, 0, x, viewHeight, paint)
  }
  for (let y = startY; y < viewHeight + gridSize; y += gridSize) {
    canvas.drawLine(0, y, viewWidth, y, paint)
  }

  // Major grid
  const majorSize = gridSize * GRID_MAJOR_EVERY
  if (majorSize >= 20) {
    paint.setColor(Skia.Color(GRID_MAJOR_COLOR))
    const majorStartX = (cx % majorSize) - majorSize
    const majorStartY = (cy % majorSize) - majorSize

    for (let x = majorStartX; x < viewWidth + majorSize; x += majorSize) {
      canvas.drawLine(x, 0, x, viewHeight, paint)
    }
    for (let y = majorStartY; y < viewHeight + majorSize; y += majorSize) {
      canvas.drawLine(0, y, viewWidth, y, paint)
    }
  }
}
