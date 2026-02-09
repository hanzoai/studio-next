import type { StackProps, TextProps } from 'tamagui'
import { Stack, styled, Text } from 'tamagui'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

const ButtonFrame = styled(Stack, {
  name: 'Button',
  tag: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  gap: '$spacing8',
  borderRadius: '$rounded8',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  hoverStyle: {
    opacity: 0.9,
  },
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontWeight: '600',
})

interface VariantStyle {
  bg: StackProps['backgroundColor']
  textColor: TextProps['color']
  borderWidth?: number
  borderColor?: StackProps['borderColor']
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
  primary: { bg: '$accent1', textColor: '$surface1' },
  secondary: { bg: '$surface3', textColor: '$neutral1' },
  outline: {
    bg: 'transparent',
    textColor: '$neutral1',
    borderWidth: 1,
    borderColor: '$surface3',
  },
  ghost: { bg: 'transparent', textColor: '$neutral1' },
  destructive: { bg: '$statusCritical', textColor: '$surface1' },
}

interface SizeStyle {
  px: number
  py: number
  height: number
  fontSize: number
}

const sizeStyles: Record<ButtonSize, SizeStyle> = {
  sm: { px: 8, py: 4, height: 28, fontSize: 12 },
  md: { px: 12, py: 8, height: 36, fontSize: 13 },
  lg: { px: 16, py: 12, height: 44, fontSize: 14 },
}

export interface ButtonProps extends Omit<StackProps, 'children'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]

  return (
    <ButtonFrame
      backgroundColor={v.bg}
      borderWidth={v.borderWidth ?? 0}
      borderColor={v.borderColor}
      px={s.px}
      py={s.py}
      height={s.height}
      width={fullWidth ? '100%' : undefined}
      opacity={disabled ? 0.5 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      pointerEvents={disabled ? 'none' : 'auto'}
      {...props}
    >
      {icon}
      {typeof children === 'string' ? (
        <ButtonText color={v.textColor} fontSize={s.fontSize}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  )
}

Button.displayName = 'Button'
