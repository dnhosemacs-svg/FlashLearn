// src/components/ui/Input.tsx
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  containerClassName = '',
  ...rest
}: InputProps) {
  const messageId = id ? (error ? `${id}-error` : hint ? `${id}-hint` : undefined) : undefined
  const inputClassName = [
    'w-full rounded-md border bg-slate-900 px-3 py-2 text-slate-100 outline-none transition',
    'placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/70',
    error ? 'border-rose-500 focus:ring-rose-500/70' : 'border-slate-700',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`space-y-1 ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={messageId}
        className={inputClassName}
        {...rest}
      />
      {error ? (
        <p id={messageId} role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}