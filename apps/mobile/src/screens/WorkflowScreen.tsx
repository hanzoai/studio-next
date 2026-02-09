import React, { useMemo, useState, useCallback } from 'react'
import { Stack, Text } from 'tamagui'
import { useWindowDimensions } from 'react-native'
import { Graph, GraphCanvas } from '@studio/graph'
import { BodySmall } from '@studio/ui'

function createSimpleGraph(): Graph {
  const graph = new Graph()

  const loader = graph.addNode('CheckpointLoaderSimple', 'Load Checkpoint', [50, 50], {
    outputs: [
      { name: 'MODEL', type: 'MODEL', link: null, links: [] },
      { name: 'CLIP', type: 'CLIP', link: null, links: [] },
      { name: 'VAE', type: 'VAE', link: null, links: [] },
    ],
    bgColor: '#523e73',
  })

  const sampler = graph.addNode('KSampler', 'KSampler', [350, 50], {
    inputs: [
      { name: 'model', type: 'MODEL', link: null },
      { name: 'positive', type: 'CONDITIONING', link: null },
      { name: 'negative', type: 'CONDITIONING', link: null },
      { name: 'latent_image', type: 'LATENT', link: null },
    ],
    outputs: [{ name: 'LATENT', type: 'LATENT', link: null, links: [] }],
    widgets: [
      { name: 'steps', type: 'slider', value: 20, options: { min: 1, max: 100 } },
      { name: 'cfg', type: 'slider', value: 7, options: { min: 1, max: 30 } },
    ],
    bgColor: '#4a5e3e',
  })

  const decode = graph.addNode('VAEDecode', 'VAE Decode', [650, 50], {
    inputs: [
      { name: 'samples', type: 'LATENT', link: null },
      { name: 'vae', type: 'VAE', link: null },
    ],
    outputs: [{ name: 'IMAGE', type: 'IMAGE', link: null, links: [] }],
    bgColor: '#3e5c73',
  })

  graph.addLink(loader.id, 0, sampler.id, 0, 'MODEL')
  graph.addLink(sampler.id, 0, decode.id, 0, 'LATENT')
  graph.addLink(loader.id, 2, decode.id, 1, 'VAE')

  return graph
}

export function WorkflowScreen() {
  const { width, height } = useWindowDimensions()
  const graph = useMemo(() => createSimpleGraph(), [])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const handleNodeSelect = useCallback((nodeId: number | null) => {
    setSelectedNode(nodeId)
  }, [])

  return (
    <Stack flex={1} backgroundColor="$surface1">
      <GraphCanvas
        graph={graph}
        width={width}
        height={height - 120}
        onNodeSelect={handleNodeSelect}
      />
      <Stack
        height={40}
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="$spacing12"
        backgroundColor="$surface2"
        borderTopWidth={1}
        borderTopColor="$surface3"
        gap="$spacing12"
      >
        <BodySmall color="$neutral3">
          {selectedNode ? `Node #${selectedNode}` : 'Tap a node to select'}
        </BodySmall>
        <BodySmall color="$neutral3">
          {graph.nodes.size} nodes, {graph.links.size} links
        </BodySmall>
      </Stack>
    </Stack>
  )
}
