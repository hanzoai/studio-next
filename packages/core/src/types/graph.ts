import { z } from 'zod'

/** Slot types for node inputs/outputs */
export type SlotType = 'IMAGE' | 'LATENT' | 'MODEL' | 'CLIP' | 'VAE' | 'CONDITIONING' | 'MASK' | 'INT' | 'FLOAT' | 'STRING' | 'BOOLEAN' | '*'

/** A single node slot (input or output) */
export interface NodeSlot {
  name: string
  type: SlotType | string
  link: number | null
}

/** Widget definition for in-node controls */
export interface NodeWidget {
  name: string
  type: 'number' | 'slider' | 'combo' | 'text' | 'toggle' | 'image' | 'color'
  value: unknown
  options?: Record<string, unknown>
}

/** Position as [x, y] */
export type Position = [number, number]

/** Size as [width, height] */
export type Size = [number, number]

/** Serialized node in a workflow */
export const SerializedNodeSchema = z.object({
  id: z.number(),
  type: z.string(),
  pos: z.tuple([z.number(), z.number()]),
  size: z.tuple([z.number(), z.number()]),
  flags: z.record(z.unknown()).optional(),
  order: z.number().optional(),
  mode: z.number().optional(),
  inputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    link: z.number().nullable(),
  })).optional(),
  outputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    links: z.array(z.number()).nullable(),
    slot_index: z.number().optional(),
  })).optional(),
  properties: z.record(z.unknown()).optional(),
  widgets_values: z.array(z.unknown()).optional(),
})

export type SerializedNode = z.infer<typeof SerializedNodeSchema>

/** Serialized link: [id, origin_id, origin_slot, target_id, target_slot, type] */
export const SerializedLinkSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.string(),
])

export type SerializedLink = z.infer<typeof SerializedLinkSchema>

/** Full workflow format (compatible with litegraph/ComfyUI) */
export const WorkflowSchema = z.object({
  last_node_id: z.number(),
  last_link_id: z.number(),
  nodes: z.array(SerializedNodeSchema),
  links: z.array(SerializedLinkSchema),
  groups: z.array(z.object({
    title: z.string(),
    bounding: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    color: z.string().optional(),
  })).optional(),
  config: z.record(z.unknown()).optional(),
  extra: z.record(z.unknown()).optional(),
  version: z.number().optional(),
})

export type Workflow = z.infer<typeof WorkflowSchema>

/** Runtime node state during execution */
export interface NodeExecutionState {
  nodeId: number
  status: 'idle' | 'queued' | 'running' | 'completed' | 'error'
  progress?: number
  error?: string
  output?: Record<string, unknown>
}

/** Node definition from the server */
export interface NodeDefinition {
  name: string
  display_name: string
  category: string
  description: string
  input: {
    required?: Record<string, [string, Record<string, unknown>?]>
    optional?: Record<string, [string, Record<string, unknown>?]>
    hidden?: Record<string, string>
  }
  input_order?: {
    required?: string[]
    optional?: string[]
  }
  output: string[]
  output_name: string[]
  output_is_list: boolean[]
  output_node: boolean
  python_module: string
  deprecated?: boolean
  experimental?: boolean
}
