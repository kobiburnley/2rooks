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

Or an array to create a nested category tree of any depth:
[
  {
    "id": "sicilian",
    "name": "Sicilian Defense",
    "description": "The most popular response to 1.e4, creating asymmetric positions with chances for both sides.",
    "moves": []
  },
  {
    "id": "sicilian-najdorf",
    "name": "Najdorf Variation",
    "description": "The sharpest and most theoretically rich Sicilian, favoured by Fischer and Kasparov.",
    "parentId": "sicilian",
    "moves": []
  },
  {
    "id": "sicilian-najdorf-english-attack",
    "name": "English Attack",
    "description": "White plays f3, Be3, Qd2 and g4, launching a kingside attack before Black can react.",
    "parentId": "sicilian-najdorf",
    "moves": [
      { "san": "e4", "explanation": "White stakes a claim in the center." },
      { "san": "c5", "explanation": "The Sicilian — Black fights for d4 asymmetrically." }
    ]
  }
]

Categories nest to any depth via parentId chains (grandparent → parent → child → grandchild…). Each node either groups sub-variations (empty moves) or is a concrete line to study (non-empty moves), or both.

Rules:
- "id": unique kebab-case string
- "name": human-readable name
- "description": 1–2 sentence description
- "parentId": optional — references the "id" of the direct parent; omit for top-level entries
- "moves": array of { "san", "explanation" } — san must be valid Standard Algebraic Notation in legal sequence from the starting position; explanation should be 1 sentence describing the purpose of the move
- A node with an empty "moves" array is a pure category used only for grouping
- Respond with ONLY the JSON wrapped in a \`\`\`json code block, no explanation`
}
