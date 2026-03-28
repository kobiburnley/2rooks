export function buildAiPrompt(request: string): string {
  return `I'm learning chess openings and I'd like you to generate: ${request}

Respond with JSON in this exact format.

Single opening:
{
  "id": "kings-indian-classical",
  "name": "Classical Variation",
  "description": "A brief description of this opening.",
  "parentId": "kings-indian",
  "moves": [
    { "san": "d4", "explanation": "White controls the center with the queen pawn." },
    { "san": "Nf6", "explanation": "Black develops the knight, contesting e4." }
  ]
}

Or an array to create a full category tree (parent + variations):
[
  {
    "id": "kings-indian",
    "name": "King's Indian Defense",
    "description": "A hypermodern defense where Black allows White to build a big center then counterattacks it.",
    "moves": []
  },
  {
    "id": "kings-indian-classical",
    "name": "Classical Variation",
    "description": "White develops classically and Black prepares the central break.",
    "parentId": "kings-indian",
    "moves": [
      { "san": "d4", "explanation": "White opens with the queen pawn." },
      { "san": "Nf6", "explanation": "Black develops the knight." }
    ]
  }
]

Rules:
- "id": unique kebab-case string
- "name": human-readable name
- "description": 1–2 sentence description
- "parentId": optional — links a variation to its parent category id
- "moves": array of { "san", "explanation" } — san must be valid Standard Algebraic Notation in legal sequence; explanation should be 1 sentence describing the purpose of the move
- Categories that only group variations have an empty "moves" array
- Respond with ONLY the JSON wrapped in a \`\`\`json code block, no explanation`
}
