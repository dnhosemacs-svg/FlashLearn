import { TextInput } from '@carbon/react'

interface InputCarbonProps
  extends Omit<
    React.ComponentProps<typeof TextInput>,
    'id' | 'labelText' | 'invalid' | 'invalidText' | 'helperText'
  > {
  id: string
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export default function InputCarbon({
  label,
  error,
  hint,
  id,
  containerClassName,
  ...rest
}: InputCarbonProps) {
  return (
    <div className={containerClassName}>
      <TextInput
        id={id}
        labelText={label ?? ''}
        invalid={Boolean(error)}
        invalidText={error ?? ''}
        helperText={error ? undefined : hint}
        {...rest}
      />
    </div>
  )
}