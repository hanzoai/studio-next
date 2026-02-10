/**
 * Custom xyflow node renderer for ComfyUI-style nodes.
 * Renders title bar, input/output handles, and in-node widgets.
 */
import React, { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { StudioNodeData } from '../adapter'
import { getSlotColor, getCategoryColor } from '../adapter'

type StudioFlowNode = Node<StudioNodeData>

const styles = {
  node: {
    minWidth: 210,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    fontSize: 12,
    fontFamily: 'Inter, system-ui, sans-serif',
  } as React.CSSProperties,
  title: {
    padding: '6px 10px',
    fontWeight: 600,
    fontSize: 13,
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    userSelect: 'none' as const,
  } as React.CSSProperties,
  body: {
    padding: '4px 0',
  } as React.CSSProperties,
  slotRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
    padding: '0 10px',
  } as React.CSSProperties,
  inputLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  } as React.CSSProperties,
  outputLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right' as const,
  } as React.CSSProperties,
  widget: {
    margin: '2px 8px',
    padding: '3px 6px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 22,
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  widgetLabel: {
    color: 'rgba(255,255,255,0.5)',
    zIndex: 1,
  } as React.CSSProperties,
  widgetValue: {
    color: 'rgba(255,255,255,0.9)',
    zIndex: 1,
  } as React.CSSProperties,
  sliderFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(100,181,246,0.25)',
    borderRadius: 4,
  } as React.CSSProperties,
  handle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    border: '2px solid rgba(0,0,0,0.5)',
  } as React.CSSProperties,
}

function SliderFill({ value, min = 0, max = 1 }: { value: number; min?: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return <div style={{ ...styles.sliderFill, width: `${pct}%` }} />
}

function StudioNodeInner({ data }: NodeProps<StudioFlowNode>) {
  const bgColor = (data.bgColor as string | undefined) ?? getCategoryColor(data.type as string)
  const titleColor = (data.color as string | undefined) ?? '#555'
  const inputs = data.inputs as StudioNodeData['inputs']
  const outputs = data.outputs as StudioNodeData['outputs']
  const widgets = data.widgets as StudioNodeData['widgets']
  const maxSlots = Math.max(inputs.length, outputs.length)

  return (
    <div style={{ ...styles.node, backgroundColor: bgColor }}>
      {/* Title bar */}
      <div style={{ ...styles.title, backgroundColor: titleColor }}>
        {data.label as string}
      </div>

      <div style={styles.body}>
        {/* Slots - inputs on left, outputs on right */}
        {Array.from({ length: maxSlots }, (_, i) => {
          const input = inputs[i]
          const output = outputs[i]
          return (
            <div key={i} style={styles.slotRow}>
              <div style={styles.inputLabel}>
                {input && (
                  <>
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={`input-${i}`}
                      style={{
                        ...styles.handle,
                        backgroundColor: getSlotColor(input.type),
                        top: 'auto',
                      }}
                    />
                    {input.name}
                  </>
                )}
              </div>
              <div style={styles.outputLabel}>
                {output && (
                  <>
                    {output.name}
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={`output-${i}`}
                      style={{
                        ...styles.handle,
                        backgroundColor: getSlotColor(output.type),
                        top: 'auto',
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Widgets */}
        {widgets.map((widget: StudioNodeData['widgets'][number]) => (
          <div key={widget.name} style={styles.widget}>
            {widget.type === 'slider' && (
              <SliderFill
                value={Number(widget.value ?? 0)}
                min={Number(widget.options?.min ?? 0)}
                max={Number(widget.options?.max ?? 1)}
              />
            )}
            <span style={styles.widgetLabel}>{widget.name}</span>
            <span style={styles.widgetValue}>{String(widget.value ?? '')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const StudioNode = memo(StudioNodeInner)
StudioNode.displayName = 'StudioNode'
