import React from 'react'
import { Stack } from '@hanzo/gui'
import { Card, Input, Heading3, Body, BodySmall, Button } from '@studio/ui'

export function SettingsScreen() {
  return (
    <Stack flex={1} backgroundColor="$surface1" padding="$spacing16" gap="$spacing16">
      <Card title="Server Connection">
        <Stack gap="$spacing12">
          <Input label="Server URL" placeholder="http://127.0.0.1:8188" />
          <Button variant="primary" size="md">
            Connect
          </Button>
        </Stack>
      </Card>

      <Card title="About">
        <Stack gap="$spacing4">
          <Body>Hanzo Studio Mobile</Body>
          <BodySmall color="$neutral3">Version 2.0.0-alpha</BodySmall>
          <BodySmall color="$neutral3">React Native + @hanzo/gui</BodySmall>
        </Stack>
      </Card>
    </Stack>
  )
}
