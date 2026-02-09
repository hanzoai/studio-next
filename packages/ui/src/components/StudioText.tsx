import { styled, Text } from 'tamagui'

export const Heading1 = styled(Text, {
  name: 'Heading1',
  fontFamily: '$heading',
  fontSize: 30,
  fontWeight: '700',
  color: '$neutral1',
})

export const Heading2 = styled(Text, {
  name: 'Heading2',
  fontFamily: '$heading',
  fontSize: 24,
  fontWeight: '700',
  color: '$neutral1',
})

export const Heading3 = styled(Text, {
  name: 'Heading3',
  fontFamily: '$heading',
  fontSize: 18,
  fontWeight: '600',
  color: '$neutral1',
})

export const Body = styled(Text, {
  name: 'Body',
  fontFamily: '$body',
  fontSize: 14,
  fontWeight: '400',
  color: '$neutral1',
})

export const BodySmall = styled(Text, {
  name: 'BodySmall',
  fontFamily: '$body',
  fontSize: 12,
  fontWeight: '400',
  color: '$neutral2',
})

export const Label = styled(Text, {
  name: 'Label',
  fontFamily: '$body',
  fontSize: 12,
  fontWeight: '500',
  color: '$neutral2',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
})

export const Mono = styled(Text, {
  name: 'Mono',
  fontFamily: '$mono',
  fontSize: 13,
  fontWeight: '400',
  color: '$neutral1',
})
