import { createGui } from '@hanzo/gui'
import { animations } from './theme/animations'
import { configWithoutAnimations } from './theme/config'

export const config = createGui({
  animations,
  ...configWithoutAnimations,
})

export default config

export type StudioConfig = typeof config

declare module '@hanzogui/core' {
  interface GuiCustomConfig extends StudioConfig {}
}
