import { styled, Stack, Text } from '@hanzo/gui'
import type { StackProps } from '@hanzo/gui'

const CardFrame = styled(Stack, {
  name: 'Card',
  backgroundColor: '$surface2',
  borderRadius: '$rounded12',
  padding: '$spacing16',
  borderWidth: 1,
  borderColor: '$surface3',
  variants: {
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$surface3',
          borderColor: '$neutral3',
        },
        pressStyle: {
          opacity: 0.9,
          scale: 0.99,
        },
      },
    },
  } as const,
})

const CardHeader = styled(Stack, {
  name: 'CardHeader',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '$spacing12',
})

const CardTitle = styled(Text, {
  name: 'CardTitle',
  fontFamily: '$heading',
  fontSize: 14,
  fontWeight: '600',
  color: '$neutral1',
})

const CardDescription = styled(Text, {
  name: 'CardDescription',
  fontFamily: '$body',
  fontSize: 12,
  color: '$neutral2',
})

export interface CardProps extends StackProps {
  title?: string
  description?: string
  elevated?: boolean
  interactive?: boolean
  headerRight?: React.ReactNode
}

export function Card({
  title,
  description,
  elevated,
  interactive,
  headerRight,
  children,
  ...props
}: CardProps) {
  return (
    <CardFrame elevated={elevated} interactive={interactive} {...props}>
      {(title || headerRight) && (
        <CardHeader>
          <Stack gap="$spacing2">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </Stack>
          {headerRight}
        </CardHeader>
      )}
      {children}
    </CardFrame>
  )
}

Card.displayName = 'Card'
