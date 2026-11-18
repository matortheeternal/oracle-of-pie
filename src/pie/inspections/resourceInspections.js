const CREATURE_CARD = { isCreatureCard: true };
const FORCED_OPPONENT = { isOptional: false, subject: { isOpponent: true } };

export const RESOURCE_INSPECTIONS = [
    {
        id: 'discard-opponent',
        title: 'Makes opponents discard',
        match: { kind: 'DiscardEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'mill-opponent',
        title: 'Mills opponents',
        match: { kind: 'MillEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'tutor-nonland',
        title: 'Searches the library for a nonland card',
        match: { kind: 'SearchLibraryEffect', toHand: true, findsLand: false }
    },
    {
        id: 'land-ramp',
        title: 'Puts lands from the library onto the battlefield',
        match: {
            kind: 'SearchLibraryEffect',
            card: { isLand: false },
            findsLand: true,
            toBattlefield: true
        }
    },
    {
        id: 'reanimate',
        title: 'Returns creature cards from graveyard to battlefield',
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
        id: 'regrowth',
        title: 'Returns creature cards from graveyard to hand',
        match: {
            kind: 'ReturnEffect',
            destination: 'hand',
            fromGraveyard: true,
            phrases: CREATURE_CARD
        }
    }
];
