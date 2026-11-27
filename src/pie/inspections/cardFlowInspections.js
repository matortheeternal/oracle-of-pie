import tagInspection from './tagInspection.js';

export const CARD_FLOW_INSPECTIONS = [
    tagInspection({
        id: 'draw-cards',
        title: 'Draws cards',
        cards: 'cards that draw cards',
        group: 'Card flow',
        example: { typeLine: 'Sorcery', text: 'Draw two cards.' },
        tag: 'draw'
    }),
    tagInspection({
        id: 'loot',
        title: 'Draws, then discards',
        cards: 'cards that draw, then discard',
        group: 'Card flow',
        example: { typeLine: 'Instant', text: 'Draw two cards, then discard a card.' }
    }),
    tagInspection({
        id: 'rummage',
        title: 'Discards, then draws',
        cards: 'cards that discard, then draw',
        group: 'Card flow',
        example: { typeLine: 'Instant', text: 'Discard a card, then draw a card.' },
        allowedWherever: 'loot'
    }),
    tagInspection({
        id: 'discard-outlet',
        title: 'Discards your own cards',
        cards: 'cards that discard your own cards',
        group: 'Costs',
        example: {
            typeLine: 'Creature',
            text: 'Discard a card: This creature gets +1/+1 until end of turn.'
        }
    }),
    tagInspection({
        id: 'mill-self',
        title: 'Mills yourself',
        cards: 'cards that mill you',
        group: 'Graveyard',
        example: { typeLine: 'Sorcery', text: 'Mill four cards.' },
        atLeast: { W: 'tertiary' }
    })
];
