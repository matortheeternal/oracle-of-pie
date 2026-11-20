const SOURCE_TEXT = { granted: false, expansion: null };
const GRAVEYARD = { zone: 'graveyard' };
const CARD_TYPES_IN_GRAVEYARD = new RegExp(
    String.raw`\bcard types? (?:among|of) cards? (?:in|from) `
    + String.raw`(?:your|all|a|that player's) graveyards?\b`, 'i'
);
const COUNTED_GRAVEYARD_CARDS = new RegExp(
    String.raw`\b(?:for each|the number of) (?:[\w'-]+(?:,? )+)?`
    + String.raw`cards? in (?:your|all) graveyards?\b`, 'i'
);
const TOP_OF_LIBRARY = { kind: 'LookAtTopEffect', verb: ['look', 'reveal'] };
const SELF_MILL = { kind: 'MillEffect', subjectIsYou: true };
const PERMANENT_TYPES = ['artifact', 'battle', 'creature', 'enchantment', 'planeswalker'];
const PREVIOUS_GROUP = /^from among them$/i;
const LIBRARY_DESTINATION = /\blibrary\b/i;

function afterEffect(effect) {
    return {
        any: [
            { effectOrder: [effect, { kind: 'PutEffect' }] },
            { previous: { effects: effect } }
        ]
    };
}

function graveyardSentence(raw) {
    return { kind: 'Sentence', context: SOURCE_TEXT, raw };
}

const CAST_FROM_GRAVEYARD = {
    kind: 'PlayCardsEffect',
    allowsLands: false,
    isOptional: true,
    context: SOURCE_TEXT
};
const PERMANENT_CARD = {
    any: [
        { hasExactType: PERMANENT_TYPES },
        { hasExactType: 'permanent', excludesType: 'land' },
        { hasSubtype: ['Aura', 'Equipment'] }
    ]
};
const ESCAPE = {
    kind: 'Keyword',
    name: 'escape',
    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
};

export const GRAVEYARD_TAGS = [
    {
        tag: 'mulch',
        match: {
            kind: 'PutEffect',
            context: SOURCE_TEXT,
            any: [
                {
                    sendsRestToGraveyard: true,
                    context: { sentence: afterEffect(TOP_OF_LIBRARY) }
                },
                {
                    any: [
                        { selectsMilledCards: true },
                        {
                            phrases: {
                                modifiers: { kind: 'ZoneModifier', raw: PREVIOUS_GROUP }
                            }
                        }
                    ],
                    context: { sentence: afterEffect(SELF_MILL) }
                }
            ]
        }
    },
    {
        tag: 'restock',
        match: {
            context: SOURCE_TEXT,
            any: [
                {
                    kind: 'ShuffleIntoLibraryEffect',
                    zones: ['graveyard', 'hand and graveyard', 'graveyard and hand']
                },
                { kind: 'ReturnEffect', fromGraveyard: true, destination: 'library' },
                {
                    kind: 'PutEffect',
                    destination: LIBRARY_DESTINATION,
                    phrases: GRAVEYARD
                }
            ]
        }
    },
    {
        tag: 'card-types-in-graveyard-matter',
        match: graveyardSentence(CARD_TYPES_IN_GRAVEYARD)
    },
    {
        tag: 'cards-in-graveyard-matter',
        match: {
            ...graveyardSentence(COUNTED_GRAVEYARD_CARDS),
            not: { effects: { kind: 'CostModificationEffect' } }
        }
    },
    {
        tag: 'graveyard-fuel',
        match: {
            any: [
                ESCAPE,
                {
                    kind: 'ExileCost',
                    isRecognized: true,
                    phrases: { ...GRAVEYARD, zoneOwnedByYou: true, refersToSelf: false },
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'graveyard-fuel-creature',
        match: {
            kind: 'ExileCost',
            isRecognized: true,
            phrases: {
                ...GRAVEYARD,
                zoneOwnedByYou: true,
                kind: 'NounPhrase',
                hasExactType: 'creature',
                allowsTypeAlone: 'creature'
            },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'reanimate-cast',
        match: {
            any: [
                { ...ESCAPE, card: { isInstantOrSorcery: false, isLand: false } },
                { ...CAST_FROM_GRAVEYARD, phrases: { ...GRAVEYARD, ...PERMANENT_CARD } }
            ]
        }
    },
    {
        tag: 'banish-graveyard',
        match: {
            kind: 'ExileEffect',
            isUntilLeaves: true,
            phrases: { ...GRAVEYARD, kind: 'NounPhrase' },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'imprint',
        match: {
            kind: 'AbilityWordAbility',
            abilityWord: 'Imprint',
            context: SOURCE_TEXT
        }
    }
];
