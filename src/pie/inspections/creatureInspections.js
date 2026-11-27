const OPPOSING_OBJECT = { isOpposingObject: true };

export const CREATURE_INSPECTIONS = [
    {
        id: 'tap-creature',
        title: 'Taps opposing creatures',
        cards: 'cards that tap opposing creatures',
        group: 'Control',
        scryfall: 'otag:tapper-creature',
        example: { typeLine: 'Instant', text: 'Tap target creature.' },
        match: {
            kind: 'TapEffect',
            phrases: {
                isOpposingObject: true,
                isBackReference: false,
                hasExactType: 'creature',
                not: { kind: 'AttachedReference' }
            }
        }
    },
    {
        id: 'steal-permanently',
        title: 'Gains control permanently',
        cards: 'cards that gain control permanently',
        group: 'Control',
        scryfall: 'otag:control-changing-effects -otag:threaten',
        example: { typeLine: 'Sorcery', text: 'Gain control of target creature.' },
        match: { kind: 'GainControlEffect', duration: null, phrases: OPPOSING_OBJECT }
    },
    {
        id: 'threaten',
        title: 'Gains control until end of turn',
        cards: 'cards that gain control until end of turn',
        group: 'Control',
        scryfall: 'otag:threaten',
        example: {
            typeLine: 'Sorcery',
            text: 'Gain control of target creature until end of turn. Untap that '
                + 'creature. It gains haste until end of turn.'
        },
        match: {
            kind: 'GainControlEffect',
            duration: { isUntilEndOfTurn: true },
            phrases: OPPOSING_OBJECT
        }
    },
    {
        id: 'flicker',
        title: 'Exiles and returns creatures',
        cards: 'cards that exile and return creatures',
        group: 'Protection',
        scryfall: 'otag:flicker-creature',
        example: {
            typeLine: 'Instant',
            text: 'Exile target creature you control, then return that card to '
                + 'the battlefield under its owner\'s control.'
        },
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    },
    {
        id: 'gain-life',
        title: 'Gains life',
        cards: 'cards that gain life',
        group: 'Life',
        scryfall: 'otag:lifegain',
        example: { typeLine: 'Instant', text: 'You gain 4 life.' },
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    }
];
