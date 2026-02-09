/** Model type categories */
export type ModelType =
  | 'checkpoints'
  | 'clip'
  | 'clip_vision'
  | 'controlnet'
  | 'diffusers'
  | 'embeddings'
  | 'gligen'
  | 'hypernetworks'
  | 'loras'
  | 'style_models'
  | 'unet'
  | 'upscale_models'
  | 'vae'
  | 'vae_approx'

/** A model file on disk */
export interface ModelFile {
  name: string
  path: string
  type: ModelType
  size?: number
  hash?: string
}

/** Model download info */
export interface ModelDownload {
  url: string
  filename: string
  type: ModelType
  progress: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
}
