import type { Opening } from '../types'

export const DEFAULT_OPENINGS: Opening[] = [
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Spanish Game)',
    description:
      'One of the oldest and most classical openings in chess. White immediately pressures Black\'s knight that defends the e5 pawn, aiming for long-term positional advantage and control of the center.',
    moves: [
      {
        san: 'e4',
        explanation:
          'White occupies the center with a pawn, opening lines for the queen and king\'s bishop. This is the most popular first move and stakes an immediate claim to central control.',
      },
      {
        san: 'e5',
        explanation:
          'Black mirrors White\'s strategy, contesting the center directly. The symmetry creates a balanced position from which both sides will fight for control.',
      },
      {
        san: 'Nf3',
        explanation:
          'White develops the king\'s knight with tempo, immediately attacking the e5 pawn. This is a model move — it develops a piece to its best square while creating a threat.',
      },
      {
        san: 'Nc6',
        explanation:
          'Black defends the e5 pawn by developing the queen\'s knight. This is the most natural and common response, bringing a piece out while maintaining central tension.',
      },
      {
        san: 'Bb5',
        explanation:
          'The hallmark of the Ruy Lopez. White pins the knight that defends e5, creating an indirect long-term threat to win the pawn. The bishop also eyes the kingside from b5.',
      },
      {
        san: 'a6',
        explanation:
          'The Morphy Defense — Black challenges the bishop immediately. This move gains space on the queenside and asks White to declare intentions with the bishop.',
      },
      {
        san: 'Ba4',
        explanation:
          'White retreats to maintain the pin and keep pressure on the knight. Exchanging on c6 would double Black\'s pawns but give up the bishop pair, so White keeps the tension.',
      },
      {
        san: 'Nf6',
        explanation:
          'Black develops the king\'s knight and counterattacks the e4 pawn. This is the sharpest and most theoretically important reply in the Ruy Lopez.',
      },
      {
        san: 'O-O',
        explanation:
          'White castles, securing the king and connecting the rooks. This is a key moment — White ignores the threat to e4, setting up the famous "Open Ruy Lopez" if Black takes the pawn.',
      },
      {
        san: 'Be7',
        explanation:
          'Black prepares to castle kingside. This modest move keeps all options open and prepares to unpin the knight on c6 once castling is complete.',
      },
      {
        san: 'Re1',
        explanation:
          'White places the rook on the semi-open e-file, defending the e4 pawn and supporting potential central action. This is a key preparatory move in the Closed Ruy Lopez.',
      },
      {
        san: 'b5',
        explanation:
          'Black gains queenside space and forces the bishop to move again. This is an important counter-thrust that helps Black challenge White\'s plans on that side of the board.',
      },
      {
        san: 'Bb3',
        explanation:
          'The bishop retreats to a strong diagonal where it eyes the f7 square and remains active. The bishop on b3 is one of the most powerful pieces in the Ruy Lopez.',
      },
      {
        san: 'd6',
        explanation:
          'Black solidifies the center and prepares to develop the dark-squared bishop. This move, known as the Closed Ruy Lopez, leads to rich strategic battles where both sides maneuver for advantage.',
      },
    ],
  },
  {
    id: 'sicilian-najdorf',
    name: 'Sicilian Defense: Najdorf Variation',
    description:
      'The most popular and complex chess opening at the highest levels. Black fights for the center asymmetrically, aiming for counterplay rather than symmetry. The Najdorf is famous for its aggressive, unbalanced positions.',
    moves: [
      {
        san: 'e4',
        explanation:
          'White controls the center and opens lines. This is the starting point for the Sicilian Defense, the most frequently played opening at the top level.',
      },
      {
        san: 'c5',
        explanation:
          'The Sicilian Defense. Rather than mirroring White\'s central pawn, Black fights for d4 with a flank pawn. This asymmetry creates unbalanced positions with chances for both sides.',
      },
      {
        san: 'Nf3',
        explanation:
          'White develops the knight with an eye toward d4. This is the most common continuation, preparing to advance d4 and open the center on White\'s terms.',
      },
      {
        san: 'd6',
        explanation:
          'Black prepares to develop the king\'s knight to f6 without blocking it with the e-pawn. This move also supports the c5 pawn and keeps flexible options for the dark-squared bishop.',
      },
      {
        san: 'd4',
        explanation:
          'White advances in the center, opening the position. This is the critical moment — White gives up a pawn center presence in exchange for open lines and rapid development.',
      },
      {
        san: 'cxd4',
        explanation:
          'Black captures, eliminating White\'s c-pawn and gaining the half-open c-file for later rook activity. This exchange is the foundation of Black\'s counterplay.',
      },
      {
        san: 'Nxd4',
        explanation:
          'White recaptures with the knight, centralizing it powerfully. The knight on d4 dominates the center and is very difficult to attack in the short term.',
      },
      {
        san: 'Nf6',
        explanation:
          'Black develops the knight to its best square, attacking the e4 pawn and putting pressure on White\'s center. This is the start of Black\'s active counterplay.',
      },
      {
        san: 'Nc3',
        explanation:
          'White develops the queen\'s knight, defending e4 and preparing for future operations. This is the starting point of many critical Sicilian lines.',
      },
      {
        san: 'a5',
        explanation:
          'The Najdorf move — a subtle multi-purpose advance. It prepares ...b5 to expand on the queenside, prevents Bb5+ from White, and supports future queenside counterplay that is the hallmark of the Najdorf.',
      },
    ],
  },
  {
    id: 'queens-gambit-declined',
    name: "Queen's Gambit Declined",
    description:
      "One of the most solid and respected defenses to White's d4. Black declines the gambit pawn and focuses on piece development, aiming for a solid position with latent counterattacking chances.",
    moves: [
      {
        san: 'd4',
        explanation:
          'White opens with the queen\'s pawn, fighting for central control. This move avoids many of the sharp lines that follow 1.e4 and leads to more positional struggles.',
      },
      {
        san: 'd5',
        explanation:
          'Black mirrors White, establishing an immediate central presence. This direct approach is the foundation of several classical defenses including the Queen\'s Gambit lines.',
      },
      {
        san: 'c4',
        explanation:
          "The Queen's Gambit — White offers a pawn to gain central control. Accepting it (cxd4) leads to the Queen's Gambit Accepted; declining leads to rich positional play.",
      },
      {
        san: 'e6',
        explanation:
          "Black declines the gambit, supporting the d5 pawn with the e-pawn. This is the Queen's Gambit Declined — Black willingly accepts a slightly cramped position in exchange for rock-solid structure.",
      },
      {
        san: 'Nc3',
        explanation:
          'White develops the queen\'s knight, adding pressure to d5 and preparing to advance e4. The knight is ideally placed here to support White\'s central ambitions.',
      },
      {
        san: 'Nf6',
        explanation:
          'Black develops the king\'s knight, adding another defender to the d5 pawn. The knight also eyes e4, keeping White from advancing without preparation.',
      },
      {
        san: 'Bg5',
        explanation:
          'White develops the bishop and pins the knight. This is the Classical variation of the QGD. The pin on f6 creates pressure because the f6 knight is a key defender of d5.',
      },
      {
        san: 'Be7',
        explanation:
          'Black breaks the pin by developing the dark-squared bishop. This modest move is very solid — Black prepares to castle and unpin the knight while keeping the position tight.',
      },
      {
        san: 'e3',
        explanation:
          'White solidifies the center and prepares to develop the light-squared bishop. The pawn on e3 keeps the structure firm while opening the diagonal for the bishop.',
      },
      {
        san: 'O-O',
        explanation:
          'Black castles, securing the king. Black now has a very solid position with all key pieces defended and the king safe. Future plans involve challenging White\'s center with ...c5 or ...dxc4.',
      },
      {
        san: 'Nf3',
        explanation:
          'White develops the remaining knight, completing the development of minor pieces. The knight is perfectly placed on f3, supporting e5 advances and controlling key squares.',
      },
      {
        san: 'h6',
        explanation:
          'Black challenges the bishop, asking White to commit. This move gains space on the kingside, prevents Bh4 plans, and prepares to potentially swap off the pin with ...Ne4.',
      },
    ],
  },
  {
    id: 'traxler-counter-attack',
    name: 'Traxler Counter Attack',
    description:
      'A wild and aggressive gambit by Black against the Fried Liver setup. Instead of the safe 4...d5, Black sacrifices a piece with 4...Bc5!?, daring White to take the f7 pawn and entering a chaotic, heavily tactical battle where Black bets on the exposed White king.',
    moves: [
      {
        san: 'e4',
        explanation:
          'White opens with the king\'s pawn, claiming central space and opening lines for the queen and bishop. This is the starting point for the Two Knights Defense that the Traxler aims to exploit.',
      },
      {
        san: 'e5',
        explanation:
          'Black mirrors White, immediately contesting the center. This symmetrical response sets up the open game that leads into the Two Knights Defense.',
      },
      {
        san: 'Nf3',
        explanation:
          'White develops the knight with tempo, attacking the e5 pawn. The knight heads toward the center and prepares the bishop to come to c4, eyeing f7.',
      },
      {
        san: 'Nc6',
        explanation:
          'Black defends the e5 pawn and develops the knight to its best square. This is the Two Knights Defense — Black invites sharp tactical play.',
      },
      {
        san: 'Bc4',
        explanation:
          'White deploys the bishop to the aggressive c4 square, pointing directly at the vulnerable f7 pawn — the weakest point in Black\'s position. This sets up potential Ng5 threats.',
      },
      {
        san: 'Nf6',
        explanation:
          'Black develops the king\'s knight and counterattacks e4. This is the Two Knights Defense proper. Black accepts the risk of the Ng5 attack rather than playing the safer 3...Bc5.',
      },
      {
        san: 'Ng5',
        explanation:
          'White attacks f7 with both the knight and bishop. This aggressive leap threatens Nxf7, forking the queen and rook. Black must respond carefully — or recklessly.',
      },
      {
        san: 'Bc5',
        explanation:
          'The Traxler Counter Attack! Instead of the normal 4...d5, Black develops the bishop and ignores the threat to f7. This is a piece sacrifice — Black is daring White to take on f7 and opening a vicious counterattack on the exposed White king.',
      },
      {
        san: 'Nxf7',
        explanation:
          'White accepts the challenge and grabs the f7 pawn, forking the queen and rook. This is the critical test of the Traxler — but the White king is about to be dragged into the open.',
      },
      {
        san: 'Bxf2+',
        explanation:
          'The point of the Traxler! Black sacrifices the bishop, forcing the White king off the back rank. White must capture — the attack is already blazing.',
      },
      {
        san: 'Kxf2',
        explanation:
          'White is forced to take the bishop with the king, stepping into the open. The White king on f2 is dangerously exposed and will be hunted for the rest of the game.',
      },
      {
        san: 'Nxe4+',
        explanation:
          'Black wins back a piece with check, simultaneously attacking the king and the bishop on c4. The king is forced to move again, losing time and further exposing itself to Black\'s pieces.',
      },
      {
        san: 'Kg1',
        explanation:
          'White retreats the king to relative safety. Kg3 or Ke3 lead to even more dangerous positions for White. From g1 White hopes to weather the storm, but Black\'s attack is far from over.',
      },
      {
        san: 'Qh4',
        explanation:
          'Black brings the queen into the attack with tempo, threatening Qf2# and Qxc4. The queen joins the assault and White faces multiple threats simultaneously with no easy defense.',
      },
    ],
  },
]

const STORAGE_KEY = '2rooks-openings'

export function loadOpenings(): Opening[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const storedOpenings = parsed as Opening[]
        const storedIds = new Set(storedOpenings.map(o => o.id))
        const newDefaults = DEFAULT_OPENINGS.filter(o => !storedIds.has(o.id))
        return [...storedOpenings, ...newDefaults]
      }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_OPENINGS
}

export function saveOpenings(openings: Opening[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openings))
  } catch {
    // ignore storage errors
  }
}
