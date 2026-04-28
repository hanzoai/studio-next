import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Stack } from '@hanzo/gui'
import { Graph } from '@studio/graph/engine'
import { Body, BodySmall, Card } from '@studio/ui'
import type { GraphNode } from '@studio/graph/engine'

/** Slot type → color mapping (matches web editor) */
const SLOT_COLORS: Record<string, string> = {
  MODEL: '#b39ddb',
  CLIP: '#fff176',
  VAE: '#ef5350',
  CONDITIONING: '#ffb74d',
  LATENT: '#ff80ab',
  IMAGE: '#64b5f6',
  MASK: '#81c784',
  '*': '#90a4ae',
}

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

function NodeCard({ node, isSelected, onPress }: {
  node: GraphNode
  isSelected: boolean
  onPress: () => void
}) {
  return (
    <Card
      title={node.title}
      pressable
      onPress={onPress}
      borderWidth={isSelected ? 2 : 1}
      borderColor={isSelected ? '$primary' : '$surface3'}
    >
      <Stack gap="$spacing4">
        <BodySmall color="$neutral3">{node.type}</BodySmall>

        {/* Inputs */}
        {node.inputs.length > 0 && (
          <Stack gap="$spacing2">
            <BodySmall color="$neutral2" fontWeight="600">Inputs</BodySmall>
            {node.inputs.map((slot, i) => (
              <Stack key={i} flexDirection="row" alignItems="center" gap="$spacing6">
                <Stack
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={SLOT_COLORS[slot.type] ?? SLOT_COLORS['*']}
                />
                <BodySmall color="$neutral3">
                  {slot.name} ({slot.type})
                </BodySmall>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Outputs */}
        {node.outputs.length > 0 && (
          <Stack gap="$spacing2">
            <BodySmall color="$neutral2" fontWeight="600">Outputs</BodySmall>
            {node.outputs.map((slot, i) => (
              <Stack key={i} flexDirection="row" alignItems="center" gap="$spacing6">
                <Stack
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={SLOT_COLORS[slot.type] ?? SLOT_COLORS['*']}
                />
                <BodySmall color="$neutral3">
                  {slot.name} ({slot.type})
                </BodySmall>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Widgets */}
        {node.widgets && node.widgets.length > 0 && (
          <Stack gap="$spacing2">
            <BodySmall color="$neutral2" fontWeight="600">Settings</BodySmall>
            {node.widgets.map((w, i) => (
              <BodySmall key={i} color="$neutral3">
                {w.name}: {String(w.value)}
              </BodySmall>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

export function WorkflowScreen() {
  const graph = useMemo(() => createSimpleGraph(), [])
  const [selectedNode, setSelectedNode] = useState<number | null>(null)

  const nodes = useMemo(() => Array.from(graph.nodes.values()), [graph])

  return (
    <Stack flex={1} backgroundColor="$surface1">
      {/* Header */}
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$spacing12"
        paddingVertical="$spacing8"
        backgroundColor="$surface2"
        borderBottomWidth={1}
        borderBottomColor="$surface3"
      >
        <Body color="$neutral1">Workflow</Body>
        <BodySmall color="$neutral3">
          {graph.nodes.size} nodes, {graph.links.size} links
        </BodySmall>
      </Stack>

      {/* Node list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            onPress={() => setSelectedNode(
              selectedNode === node.id ? null : node.id
            )}
          />
        ))}
      </ScrollView>
    </Stack>
  )
}
