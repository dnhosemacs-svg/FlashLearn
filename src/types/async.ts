export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState {
  status: AsyncStatus
  error: string | null
}