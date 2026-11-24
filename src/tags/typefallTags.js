const SOURCE_TEXT = { granted: false, expansion: null };
const OWN_TYPEFALL = {
    any: [
        SOURCE_TEXT,
        {
            granted: true,
            expansion: null,
            abilityController: 'you',
            abilityRecipient: { any: [{ refersToSelf: true }, { kind: 'CreatedToken' }] }
        }
    ]
};
const LAND_SUBTYPES = [
    'Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Desert', 'Gate', 'Cave'
];
const HISTORIC = { hasExactType: 'permanent', hasQualifier: 'historic' };

function typefallAbilityWord(abilityWord) {
    return { kind: 'AbilityWordAbility', abilityWord, context: OWN_TYPEFALL };
}

function entryTrigger(entrant) {
    const permanent = {
        kind: 'NounPhrase',
        isCardInZone: false,
        not: { hasExactType: 'spell' },
        ...entrant
    };
    return {
        kind: 'TriggeredAbility',
        context: OWN_TYPEFALL,
        events: {
            kind: 'EntersEvent',
            isSelf: false,
            unreadSubject: null,
            any: [
                { subjectPhrase: permanent },
                { subjectPhrase: { kind: 'SelfOrAnother', other: permanent } }
            ]
        }
    };
}

export const TYPEFALL_TAGS = [
    {
        tag: 'landfall',
        match: {
            any: [
                typefallAbilityWord('Landfall'),
                entryTrigger({
                    any: [
                        { hasExactType: 'land', allowsTypeAlone: 'land' },
                        ...LAND_SUBTYPES.map(subtype => ({ hasSubtype: subtype }))
                    ]
                })
            ]
        }
    },
    {
        tag: 'creaturefall',
        match: {
            any: [
                typefallAbilityWord('Alliance'),
                entryTrigger({ hasExactType: 'creature' }),
                {
                    kind: 'Keyword',
                    name: ['evolve', 'soulbond'],
                    context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
                }
            ]
        }
    },
    {
        tag: 'artifactfall',
        match: entryTrigger({
            any: [
                { hasExactType: 'artifact', allowsTypeAlone: 'artifact' },
                HISTORIC
            ]
        })
    },
    {
        tag: 'legendfall',
        match: entryTrigger({ any: [{ hasQualifier: 'legendary' }, HISTORIC] })
    }
];
