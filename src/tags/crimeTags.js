const TARGETED_OBJECT = { kind: 'NounPhrase', isTargeted: true };
const HOSTILE_EFFECT = {
    kind: [
        'DestroyEffect', 'ExileEffect', 'DamageEffect', 'TapEffect', 'FightEffect',
        'CounterEffect'
    ]
};
const REPEATABLE_ABILITY = {
    card: { isInstantOrSorcery: false },
    ability: {
        kind: ['ActivatedAbility', 'TriggeredAbility'],
        isRepeatable: true,
        isUltimate: false
    },
    granted: false,
    expansion: null,
    delayedTrigger: null,
    temporaryGrant: null
};

export const CRIME_TAGS = [
    {
        tag: 'repeatable-crime',
        match: {
            kind: ['AnyTarget', 'NounPhrase'],
            context: REPEATABLE_ABILITY,
            any: [
                { kind: 'AnyTarget' },
                { ...TARGETED_OBJECT, controlledByOpponent: true },
                { ...TARGETED_OBJECT, zone: 'graveyard', zoneOwnedByYou: false },
                {
                    ...TARGETED_OBJECT,
                    controlledByYou: false,
                    isCardInZone: false,
                    context: { parentEffect: HOSTILE_EFFECT }
                }
            ]
        }
    }
];
