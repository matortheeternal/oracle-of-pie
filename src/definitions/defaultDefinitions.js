const TYPECYCLING = /(?<type>[a-z]+(?: land)?)cycling/;

export const DEFAULT_DEFINITIONS = {
    keywords: [
        {
            name: 'Battle cry',
            reminder: 'Whenever this creature attacks, each other attacking creature '
                + 'gets +1/+0 until end of turn.'
        },
        {
            name: 'Cycling',
            reminder: '{parameter}, Discard this card: Draw a card.'
        },
        {
            name: 'Firebending',
            reminder: 'Whenever this creature attacks, add {parameter} {R}. This mana '
                + 'lasts until end of combat.'
        },
        {
            name: 'Gift',
            reminder: 'You may promise an opponent a gift as you cast this spell.'
        },
        {
            name: 'Typecycling',
            pattern: TYPECYCLING,
            reminder: '{parameter}, Discard this card: Search your library for a {type} '
                + 'card, reveal it, put it into your hand, then shuffle.'
        }
    ],
    actions: [
        {
            name: 'Investigate',
            reminder: 'Create a Clue token.'
        },
        {
            name: 'Connive',
            reminder: 'Draw a card, then discard a card. If you discarded a nonland '
                + 'card, put a +1/+1 counter on this creature.'
        },
        {
            name: 'Recruit',
            reminder: 'Draw a card, then discard a card. If you discarded a nonland '
                + 'card, create a 1/1 white Human Soldier creature token.'
        }
    ],
    tokens: [
        {
            name: 'Clue',
            typeLine: 'Token Artifact — Clue',
            reminder: '{2}, Sacrifice this token: Draw a card.'
        },
        {
            name: 'Food',
            typeLine: 'Token Artifact — Food',
            reminder: '{2}, {T}, Sacrifice this token: You gain 3 life.'
        },
        {
            name: 'Treasure',
            typeLine: 'Token Artifact — Treasure',
            reminder: '{T}, Sacrifice this token: Add one mana of any color.'
        },
        {
            name: 'Powerstone',
            typeLine: 'Token Artifact — Powerstone',
            reminder: '{T}: Add {C}. This mana can\'t be spent to cast a '
                + 'nonartifact spell.'
        },
        {
            name: 'Gold',
            typeLine: 'Token Artifact — Gold',
            reminder: 'Sacrifice this token: Add one mana of any color.'
        },
        {
            name: 'Lander',
            typeLine: 'Token Artifact — Lander',
            reminder: '{2}, {T}, Sacrifice this token: Search your library for a basic '
                + 'land card, put it onto the battlefield tapped, then shuffle.'
        },
        {
            name: 'Blood',
            typeLine: 'Token Artifact — Blood',
            reminder: '{1}, {T}, Discard a card, Sacrifice this token: Draw a card.'
        }
    ]
};
