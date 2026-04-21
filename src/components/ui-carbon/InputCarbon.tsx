import { TextInput } from '@carbon/react'
import { cn } from '../../lib/cn'

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
  className,
  ...rest
}: InputCarbonProps) {
  return (
    <div className={cn('fl-input-carbon', containerClassName)}>
      <TextInput
        id={id}
        labelText={label ?? ''}
        invalid={Boolean(error)}
        invalidText={error ?? ''}
        helperText={error ? undefined : hint}
        size="sm"
        className={className}
        {...rest}
      />
    </div>
  )
}