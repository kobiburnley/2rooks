export interface Move {
  san: string
  explanation: string
}

export interface Opening {
  id: string
  name: string
  description: string
  moves: Move[]
  parentId?: string
}

export type HintState = 'piece' | 'destination' | null
