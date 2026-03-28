export interface Move {
  san: string
  explanation: string
}

export interface Opening {
  id: string
  name: string
  description: string
  moves: Move[]
}

export type HintState = 'piece' | 'destination' | null
