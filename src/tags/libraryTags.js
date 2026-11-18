const CREATURE_CARD = { isCreatureCard: true };
const GRAVEYARD_LAND = { hasExactType: 'land', zone: 'graveyard' };
const LAND_SWAP = { ability: { cost: { sacrificesOther: true } } };

const SEARCH = { kind: 'SearchLibraryEffect' };

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
        match: { ...SEARCH, findsLand: true, toBattlefield: true }
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
            toBattlefield: true
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
                    context: { not: LAND_SWAP }
                },
                {
                    kind: 'PutEffect',
                    toBattlefield: true,
                    phrases: { hasExactType: 'land', zone: 'hand' }
                },
                { kind: 'ExtraLandEffect' },
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
        tag: 'reanimate-creature',
        match: {
            any: [
                {
                    kind: 'ReturnEffect',
                    destination: 'battlefield',
                    fromGraveyard: true,
                    phrases: CREATURE_CARD
                },
                {
                    kind: 'PutEffect',
                    toBattlefield: true,
                    phrases: { ...CREATURE_CARD, zone: 'graveyard' }
                }
            ]
        }
    },
    {
        tag: 'regrowth-creature',
        match: {
            kind: 'ReturnEffect',
            destination: 'hand',
            fromGraveyard: true,
            phrases: CREATURE_CARD
        }
    },
    {
        tag: 'hate-graveyard',
        match: {
            kind: 'ExileEffect',
            phrases: {
                any: [
                    { kind: 'ZonePhrase', ownedByYou: false },
                    { zone: 'graveyard', zoneOwnedByYou: false, refersToSelf: false }
                ]
            }
        }
    }
];
