import { styled, Stack, Text, Input as TamaguiInput } from 'tamagui'
import type { InputProps as TamaguiInputProps } from 'tamagui'

const InputFrame = styled(Stack, {
  name: 'InputFrame',
  flexDirection: 'column',
  gap: '$spacing4',
})

const InputLabel = styled(Text, {
  name: 'InputLabel',
  fontFamily: '$body',
  fontSize: 12,
  color: '$neutral2',
  fontWeight: '500',
})

const StyledInput = styled(TamaguiInput, {
  name: 'StudioInput',
  backgroundColor: '$surface2',
  borderColor: '$surface3',
  borderWidth: 1,
  borderRadius: '$rounded6',
  color: '$neutral1',
  fontFamily: '$body',
  fontSize: 13,
  paddingHorizontal: '$spacing8',
  height: 36,
  focusStyle: {
    borderColor: '$primary',
  },
  hoverStyle: {
    borderColor: '$neutral3',
  },
  placeholderTextColor: '$neutral3',
})

const ErrorText = styled(Text, {
  name: 'ErrorText',
  fontFamily: '$body',
  fontSize: 11,
  color: '$statusCritical',
})

export interface InputProps extends TamaguiInputProps {
  label?: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <InputFrame>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInput
        borderColor={error ? '$statusCritical' : '$surface3'}
        {...props}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </InputFrame>
  )
}

Input.displayName = 'Input'
