import React, { useMemo, useCallback, useState } from 'react'
import { Stack, Text } from 'tamagui'
import { Button, Card, Heading2, Body, BodySmall, Input } from '@studio/ui'
import { Graph } from '@studio/graph/engine'
import { GraphCanvas } from '@studio/graph'

/** Create a demo graph with 10 connected nodes */
function createDemoGraph(): Graph {
  const graph = new Graph()

  // Loader nodes
  const ckpt = graph.addNode('CheckpointLoaderSimple', 'Load Checkpoint', [50, 50], {
    outputs: [
      { name: 'MODEL', type: 'MODEL', link: null, links: [] },
      { name: 'CLIP', type: 'CLIP', link: null, links: [] },
      { name: 'VAE', type: 'VAE', link: null, links: [] },
    ],
    widgets: [
      { name: 'ckpt_name', type: 'combo', value: 'v1-5-pruned.safetensors', options: { values: ['v1-5-pruned.safetensors', 'sd_xl_base_1.0.safetensors'] } },
    ],
    bgColor: '#523e73',
  })

  // CLIP Text Encode (positive)
  const posPrompt = graph.addNode('CLIPTextEncode', 'Positive Prompt', [350, 20], {
    inputs: [{ name: 'clip', type: 'CLIP', link: null }],
    outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING', link: null, links: [] }],
    widgets: [
      { name: 'text', type: 'text', value: 'a beautiful landscape, mountains, sunset', options: { multiline: true } },
    ],
    bgColor: '#3e5573',
  })

  // CLIP Text Encode (negative)
  const negPrompt = graph.addNode('CLIPTextEncode', 'Negative Prompt', [350, 200], {
    inputs: [{ name: 'clip', type: 'CLIP', link: null }],
    outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING', link: null, links: [] }],
    widgets: [
      { name: 'text', type: 'text', value: 'ugly, blurry, low quality', options: { multiline: true } },
    ],
    bgColor: '#3e5573',
  })

  // Empty Latent Image
  const emptyLatent = graph.addNode('EmptyLatentImage', 'Empty Latent', [350, 380], {
    outputs: [{ name: 'LATENT', type: 'LATENT', link: null, links: [] }],
    widgets: [
      { name: 'width', type: 'number', value: 512 },
      { name: 'height', type: 'number', value: 512 },
      { name: 'batch_size', type: 'number', value: 1 },
    ],
    bgColor: '#533e73',
  })

  // KSampler
  const sampler = graph.addNode('KSampler', 'KSampler', [650, 100], {
    inputs: [
      { name: 'model', type: 'MODEL', link: null },
      { name: 'positive', type: 'CONDITIONING', link: null },
      { name: 'negative', type: 'CONDITIONING', link: null },
      { name: 'latent_image', type: 'LATENT', link: null },
    ],
    outputs: [{ name: 'LATENT', type: 'LATENT', link: null, links: [] }],
    widgets: [
      { name: 'seed', type: 'number', value: 42 },
      { name: 'steps', type: 'slider', value: 20, options: { min: 1, max: 100 } },
      { name: 'cfg', type: 'slider', value: 7, options: { min: 1, max: 30, step: 0.5 } },
      { name: 'sampler_name', type: 'combo', value: 'euler', options: { values: ['euler', 'euler_ancestral', 'dpmpp_2m'] } },
      { name: 'scheduler', type: 'combo', value: 'normal', options: { values: ['normal', 'karras', 'sgm_uniform'] } },
      { name: 'denoise', type: 'slider', value: 1.0, options: { min: 0, max: 1, step: 0.01 } },
    ],
    bgColor: '#4a5e3e',
  })

  // VAE Decode
  const vaeDecode = graph.addNode('VAEDecode', 'VAE Decode', [950, 150], {
    inputs: [
      { name: 'samples', type: 'LATENT', link: null },
      { name: 'vae', type: 'VAE', link: null },
    ],
    outputs: [{ name: 'IMAGE', type: 'IMAGE', link: null, links: [] }],
    bgColor: '#3e5c73',
  })

  // Save Image
  const saveImage = graph.addNode('SaveImage', 'Save Image', [1150, 150], {
    inputs: [{ name: 'images', type: 'IMAGE', link: null }],
    widgets: [
      { name: 'filename_prefix', type: 'text', value: 'HanzoStudio' },
    ],
    bgColor: '#3e5c73',
  })

  // Preview Image
  const previewImage = graph.addNode('PreviewImage', 'Preview Image', [1150, 320], {
    inputs: [{ name: 'images', type: 'IMAGE', link: null }],
    bgColor: '#3e5c73',
  })

  // LoRA Loader
  const lora = graph.addNode('LoraLoader', 'LoRA Loader', [50, 280], {
    inputs: [
      { name: 'model', type: 'MODEL', link: null },
      { name: 'clip', type: 'CLIP', link: null },
    ],
    outputs: [
      { name: 'MODEL', type: 'MODEL', link: null, links: [] },
      { name: 'CLIP', type: 'CLIP', link: null, links: [] },
    ],
    widgets: [
      { name: 'lora_name', type: 'combo', value: 'none', options: { values: ['none'] } },
      { name: 'strength_model', type: 'slider', value: 1.0, options: { min: -10, max: 10, step: 0.01 } },
      { name: 'strength_clip', type: 'slider', value: 1.0, options: { min: -10, max: 10, step: 0.01 } },
    ],
    bgColor: '#523e73',
  })

  // Upscaler
  const upscale = graph.addNode('ImageUpscaleWithModel', 'Upscale', [950, 350], {
    inputs: [
      { name: 'upscale_model', type: 'UPSCALE_MODEL', link: null },
      { name: 'image', type: 'IMAGE', link: null },
    ],
    outputs: [{ name: 'IMAGE', type: 'IMAGE', link: null, links: [] }],
    bgColor: '#3e5c73',
  })

  // Create connections
  // Checkpoint → LoRA
  graph.addLink(ckpt.id, 0, lora.id, 0, 'MODEL')
  graph.addLink(ckpt.id, 1, lora.id, 1, 'CLIP')

  // LoRA → prompts
  graph.addLink(lora.id, 1, posPrompt.id, 0, 'CLIP')
  graph.addLink(lora.id, 1, negPrompt.id, 0, 'CLIP')

  // LoRA model → sampler
  graph.addLink(lora.id, 0, sampler.id, 0, 'MODEL')

  // Prompts → sampler
  graph.addLink(posPrompt.id, 0, sampler.id, 1, 'CONDITIONING')
  graph.addLink(negPrompt.id, 0, sampler.id, 2, 'CONDITIONING')

  // Empty latent → sampler
  graph.addLink(emptyLatent.id, 0, sampler.id, 3, 'LATENT')

  // Sampler → VAE Decode
  graph.addLink(sampler.id, 0, vaeDecode.id, 0, 'LATENT')
  graph.addLink(ckpt.id, 2, vaeDecode.id, 1, 'VAE')

  // VAE Decode → outputs
  graph.addLink(vaeDecode.id, 0, saveImage.id, 0, 'IMAGE')
  graph.addLink(vaeDecode.id, 0, previewImage.id, 0, 'IMAGE')

  return graph
}

export function App() {
  const graph = useMemo(() => createDemoGraph(), [])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const handleNodeSelect = useCallback((nodeId: number | null) => {
    setSelectedNode(nodeId)
  }, [])

  return (
    <Stack flex={1} backgroundColor="$surface1">
      {/* Top bar */}
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height={48}
        paddingHorizontal="$spacing16"
        backgroundColor="$surface2"
        borderBottomWidth={1}
        borderBottomColor="$surface3"
      >
        <Stack flexDirection="row" alignItems="center" gap="$spacing12">
          <Heading2 fontSize={16} color="$primary">
            Hanzo Studio
          </Heading2>
          <BodySmall color="$neutral3">v2.0.0-alpha</BodySmall>
        </Stack>

        <Stack flexDirection="row" gap="$spacing8">
          <Button variant="ghost" size="sm">Queue</Button>
          <Button variant="primary" size="sm">Run</Button>
        </Stack>
      </Stack>

      {/* Main content */}
      <Stack flex={1} flexDirection="row">
        {/* Sidebar */}
        <Stack
          width={240}
          backgroundColor="$surface2"
          borderRightWidth={1}
          borderRightColor="$surface3"
          padding="$spacing12"
          gap="$spacing12"
        >
          <Card title="Node Info">
            {selectedNode ? (
              <Stack gap="$spacing8">
                <Body>Node #{selectedNode}</Body>
                <Body color="$neutral2">
                  {graph.getNode(selectedNode)?.title ?? 'Unknown'}
                </Body>
                <BodySmall color="$neutral3">
                  Type: {graph.getNode(selectedNode)?.type}
                </BodySmall>
              </Stack>
            ) : (
              <BodySmall color="$neutral3">Select a node to view details</BodySmall>
            )}
          </Card>

          <Card title="Graph Stats">
            <Stack gap="$spacing4">
              <BodySmall>Nodes: {graph.nodes.size}</BodySmall>
              <BodySmall>Links: {graph.links.size}</BodySmall>
            </Stack>
          </Card>

          <Input label="Search Nodes" placeholder="Type to search..." />
        </Stack>

        {/* Graph canvas area */}
        <Stack flex={1}>
          <GraphCanvas
            graph={graph}
            width={1200}
            height={800}
            onNodeSelect={handleNodeSelect}
          />
        </Stack>
      </Stack>

      {/* Bottom bar */}
      <Stack
        flexDirection="row"
        alignItems="center"
        height={28}
        paddingHorizontal="$spacing12"
        backgroundColor="$surface2"
        borderTopWidth={1}
        borderTopColor="$surface3"
        gap="$spacing16"
      >
        <BodySmall color="$neutral3">Ready</BodySmall>
        <BodySmall color="$neutral3">Zoom: 100%</BodySmall>
        <BodySmall color="$statusSuccess">Connected</BodySmall>
      </Stack>
    </Stack>
  )
}
