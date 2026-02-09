import { styled, Stack, Text } from 'tamagui'
import type { StackProps } from 'tamagui'

const Overlay = styled(Stack, {
  name: 'DialogOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '$scrim',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '$modal',
  animation: 'fast',
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
})

const DialogFrame = styled(Stack, {
  name: 'DialogFrame',
  backgroundColor: '$surface2',
  borderRadius: '$rounded16',
  borderWidth: 1,
  borderColor: '$surface3',
  padding: '$spacing24',
  minWidth: 320,
  maxWidth: 480,
  maxHeight: '80%',
  animation: 'fast',
  enterStyle: { scale: 0.95, opacity: 0 },
  exitStyle: { scale: 0.95, opacity: 0 },
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
})

const DialogTitle = styled(Text, {
  name: 'DialogTitle',
  fontFamily: '$heading',
  fontSize: 16,
  fontWeight: '600',
  color: '$neutral1',
  marginBottom: '$spacing8',
})

const DialogDescription = styled(Text, {
  name: 'DialogDescription',
  fontFamily: '$body',
  fontSize: 13,
  color: '$neutral2',
  marginBottom: '$spacing16',
})

const DialogActions = styled(Stack, {
  name: 'DialogActions',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: '$spacing8',
  marginTop: '$spacing16',
})

export interface DialogProps extends StackProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  actions,
  children,
  ...props
}: DialogProps) {
  if (!open) return null

  return (
    <Overlay onPress={onClose}>
      <DialogFrame onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()} {...props}>
        {title && <DialogTitle>{title}</DialogTitle>}
        {description && <DialogDescription>{description}</DialogDescription>}
        {children}
        {actions && <DialogActions>{actions}</DialogActions>}
      </DialogFrame>
    </Overlay>
  )
}

Dialog.displayName = 'Dialog'
