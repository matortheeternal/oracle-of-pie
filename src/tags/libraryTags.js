const ADDITIONAL_LAND = /^(?:you may )?play an additional land/i;
const CREATURE_CARD = { isCreatureCard: true };

export const LIBRARY_TAGS = [
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
                    toBattlefield: true
                },
                {
                    kind: 'PutEffect',
                    toBattlefield: true,
                    phrases: { hasExactType: 'land', zone: 'hand' }
                },
                { kind: 'OpaqueEffect', text: ADDITIONAL_LAND }
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
