/**
 * Custom bezier edge styled per slot type color.
 */
import React, { memo } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import { getSlotColor } from '../adapter'

function StudioEdgeInner({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const slotType = (data as Record<string, unknown> | undefined)?.slotType as string | undefined
  const color = getSlotColor(slotType ?? '*')

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: color,
        strokeWidth: selected ? 3.5 : 2.5,
        opacity: selected ? 1 : 0.8,
      }}
    />
  )
}

export const StudioEdge = memo(StudioEdgeInner)
StudioEdge.displayName = 'StudioEdge'
