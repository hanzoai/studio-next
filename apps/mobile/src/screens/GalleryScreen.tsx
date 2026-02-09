import React from 'react'
import { Stack } from 'tamagui'
import { Heading3, BodySmall } from '@studio/ui'

export function GalleryScreen() {
  return (
    <Stack flex={1} backgroundColor="$surface1" padding="$spacing16" alignItems="center" justifyContent="center">
      <Heading3>Gallery</Heading3>
      <BodySmall color="$neutral3" marginTop="$spacing8">
        Generated images will appear here
      </BodySmall>
    </Stack>
  )
}
