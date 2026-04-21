// Contratos genéricos para representar estado de operaciones asíncronas en UI.
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState {
  status: AsyncStatus
  error: string | null
  /** true cuando hay una recarga en segundo plano y ya existe data pintada */
  isRefreshing: boolean
}