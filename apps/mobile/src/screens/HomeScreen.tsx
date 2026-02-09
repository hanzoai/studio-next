import React from 'react'
import { Stack } from 'tamagui'
import { Button, Card, Heading2, Body, BodySmall } from '@studio/ui'

export function HomeScreen() {
  return (
    <Stack flex={1} backgroundColor="$surface1" padding="$spacing16" gap="$spacing16">
      <Heading2>Hanzo Studio</Heading2>
      <BodySmall color="$neutral3">v2.0.0-alpha</BodySmall>

      <Card title="Server Status" description="Connect to a Studio server">
        <Stack gap="$spacing8">
          <Body color="$statusCritical">Not connected</Body>
          <Button variant="primary" size="md">
            Connect
          </Button>
        </Stack>
      </Card>

      <Card title="Recent Workflows">
        <BodySmall color="$neutral3">No recent workflows</BodySmall>
      </Card>

      <Card title="Queue">
        <Stack flexDirection="row" justifyContent="space-between">
          <BodySmall>Pending: 0</BodySmall>
          <BodySmall>Running: 0</BodySmall>
          <BodySmall>Completed: 0</BodySmall>
        </Stack>
      </Card>
    </Stack>
  )
}
