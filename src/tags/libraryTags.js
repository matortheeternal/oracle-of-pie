const GRAVEYARD_LAND = { hasExactType: 'land', zone: 'graveyard' };
const LAND_SWAP = { ability: { cost: { sacrificesOther: true } } };

const REPLACE_SACRIFICED_LANDS = {
    phrases: { kind: 'NounPhrase', isBoundedByPreviousCount: true },
    context: {
        sentence: {
            previous: {
                effects: { kind: 'SacrificeEffect', phrases: { hasExactType: 'land' } }
            }
        }
    }
};

const SEARCH = { kind: 'SearchLibraryEffect' };
const SACRIFICES_LAND = {
    kind: 'SacrificeEffect',
    phrases: { hasExactType: 'land' }
};

export const LIBRARY_TAGS = [
    {
        tag: 'tutor-land-basic',
        match: { ...SEARCH, phrases: { hasType: 'land', hasQualifier: 'basic' } }
    },
    {
        tag: 'tutor-artifact',
        match: { ...SEARCH, phrases: { hasExactType: 'artifact' } }
    },
    {
        tag: 'tutor-land-to-battlefield',
        match: {
            ...SEARCH, findsLand: true, toBattlefield: true,
            not: {
                isOptional: true,
                subject: { kind: 'PlayerPhrase', player: 'that player' }
            }
        }
    },
    {
        tag: 'tutor-to-hand',
        match: { kind: 'SearchLibraryEffect', toHand: true }
    },
    {
        tag: 'fetchland',
        match: {
            kind: 'SearchLibraryEffect',
            card: { isLand: true },
            findsLand: true,
            toBattlefield: true,
            affectsYou: true
        }
    },
    {
        tag: 'land-ramp',
        match: {
            any: [
                {
                    kind: 'SearchLibraryEffect',
                    card: { isLand: false },
                    findsLand: true,
                    toBattlefield: true,
                    affectsYou: true,
                    context: { not: LAND_SWAP },
                    not: REPLACE_SACRIFICED_LANDS
                },
                {
                    kind: 'PutEffect',
                    toBattlefield: true,
                    phrases: { hasExactType: 'land', zone: 'hand' }
                },
                {
                    kind: 'ExtraLandEffect',
                    context: { not: { ability: { body: { effects: SACRIFICES_LAND } } } }
                },
                {
                    kind: 'ReturnEffect',
                    returnsToBattlefield: true,
                    phrases: GRAVEYARD_LAND
                },
                { kind: 'PutEffect', toBattlefield: true, phrases: GRAVEYARD_LAND },
                {
                    kind: 'CreateTokenEffect',
                    createsLand: true,
                    affectsYou: true,
                    card: { isLand: false }
                }
            ]
        }
    },
    {
        tag: 'multi-land-ramp',
        match: {
            tag: 'land-ramp',
            any: [
                {
                    ...SEARCH,
                    splitsBetweenBattlefieldAndHand: false,
                    phrases: { count: [2, 3, 4, 5] },
                    context: { not: { ability: { body: { effects: SACRIFICES_LAND } } } }
                },
                { kind: 'ExtraLandEffect', count: 2 }
            ]
        }
    },
    {
        tag: 'hate-graveyard',
        match: {
            kind: 'ExileEffect',
            context: { sentence: { not: { effects: { kind: 'CopyEffect' } } } },
            phrases: {
                any: [
                    { kind: 'ZonePhrase', ownedByYou: false },
                    { zone: 'graveyard', zoneOwnedByYou: false, refersToSelf: false }
                ]
            }
        }
    }
];
