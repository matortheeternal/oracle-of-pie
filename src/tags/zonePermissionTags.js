const SOURCE_TEXT = { granted: false, expansion: null };
const PRINTED_KEYWORD = {
    kind: 'Keyword',
    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
};
const GRAVEYARD_CAST_KEYWORDS = [
    'aftermath', 'beam me up', 'disturb', 'escape', 'flashback', 'harmonize',
    'jump-start', 'mayhem', 'retrace'
];
const EXILE_CAST_KEYWORDS = ['foretell', 'madness', 'plot', 'rebound', 'suspend', 'warp'];
const CYCLING_KEYWORDS = /cycling$/;
const HAND_ACTIVATION_KEYWORDS = [
    'bloodrush', 'forecast', 'ninjutsu', 'reinforce', 'transmute'
];
const GRAVEYARD_ACTIVATION_KEYWORDS = [
    'embalm', 'encore', 'eternalize', 'scavenge', 'unearth'
];
const SELF = { kind: 'SelfReference' };
const GRAVEYARD_SELF = { ...SELF, zone: 'graveyard' };
const EXILED_SELF = { ...SELF, zone: 'exile' };
const ACTIVATION = { kind: 'ActivatedAbility', context: SOURCE_TEXT };
const PLAY = { kind: 'PlayCardsEffect', context: SOURCE_TEXT, isOptional: true };
const CAST = { ...PLAY, allowsLands: false };
const GRANTS_KEYWORD = {
    kind: ['GrantEffect', 'ModifyPTEffect'],
    subject: { refersToSelf: false },
    context: SOURCE_TEXT
};

const CASTABLE_FROM_GRAVEYARD = {
    any: [
        { ...PRINTED_KEYWORD, name: GRAVEYARD_CAST_KEYWORDS },
        { ...CAST, phrases: GRAVEYARD_SELF }
    ]
};
const CASTABLE_FROM_EXILE = {
    any: [
        { ...PRINTED_KEYWORD, name: EXILE_CAST_KEYWORDS },
        { kind: 'CardText', card: { hasSubtype: 'Siege' } },
        { kind: 'CardText', card: { hasSubtype: 'Adventure' } },
        { ...CAST, phrases: EXILED_SELF }
    ]
};

export const ZONE_PERMISSION_TAGS = [
    { tag: 'castable-from-graveyard', match: CASTABLE_FROM_GRAVEYARD },
    { tag: 'castable-from-exile', match: CASTABLE_FROM_EXILE },
    {
        tag: 'castable-from-nonhand',
        match: { any: [CASTABLE_FROM_GRAVEYARD, CASTABLE_FROM_EXILE] }
    },
    {
        tag: 'gives-castable-from-graveyard',
        match: {
            any: [
                { ...CAST, phrases: { kind: 'NounPhrase', zone: 'graveyard' } },
                { ...GRANTS_KEYWORD, grantedKeywordNames: GRAVEYARD_CAST_KEYWORDS }
            ]
        }
    },
    {
        tag: 'gives-castable-from-exile',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: ['cascade', 'discover'] },
                {
                    ...GRANTS_KEYWORD,
                    grantedKeywordNames: ['cascade', 'discover', ...EXILE_CAST_KEYWORDS]
                },
                {
                    ...PLAY,
                    subjectIsYou: true,
                    phrases: {
                        kind: 'BackReference',
                        refersToSelf: false,
                        any: [
                            { antecedent: { owner: { isExile: true } } },
                            { refersToExiled: true, not: { antecedent: null } },
                            { refersToExiledCard: true }
                        ]
                    }
                },
                { tag: 'impulsive-draw' }
            ]
        }
    },
    {
        tag: 'activate-from-hand',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: HAND_ACTIVATION_KEYWORDS },
                { ...PRINTED_KEYWORD, name: CYCLING_KEYWORDS },
                {
                    ...ACTIVATION,
                    body: {
                        effects: {
                            kind: 'PutEffect',
                            toBattlefield: true,
                            phrases: { ...SELF, zone: 'hand' }
                        }
                    }
                },
                {
                    ...ACTIVATION,
                    cost: {
                        items: {
                            any: [
                                { discardsSelf: true },
                                { kind: 'ExileCost', phrases: { ...SELF, zone: 'hand' } }
                            ]
                        }
                    }
                }
            ]
        }
    },
    {
        tag: 'activate-from-graveyard',
        match: {
            any: [
                { ...PRINTED_KEYWORD, name: GRAVEYARD_ACTIVATION_KEYWORDS },
                {
                    ...ACTIVATION,
                    any: [
                        {
                            cost: {
                                items: { kind: 'ExileCost', phrases: GRAVEYARD_SELF }
                            }
                        },
                        {
                            body: {
                                effects: {
                                    kind: ['ReturnEffect', 'PutEffect'],
                                    phrases: GRAVEYARD_SELF
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },
    {
        tag: 'activate-from-exile',
        match: {
            ...ACTIVATION,
            body: {
                effects: {
                    kind: 'ReturnEffect',
                    any: [
                        { phrases: EXILED_SELF },
                        { phrases: SELF, alternativeSource: { zone: 'exile' } }
                    ]
                }
            }
        }
    },
    {
        tag: 'exile-on-resolution',
        match: {
            kind: 'ExileEffect',
            isOptional: false,
            phrases: SELF,
            context: {
                ...SOURCE_TEXT,
                ability: { kind: 'SpellAbility' },
                delayedTrigger: null,
                not: { sentence: { kind: 'ReplacementSentence' } }
            },
            card: { isInstantOrSorcery: true }
        }
    }
];
