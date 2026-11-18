const CREATURE_CARD = { isCreatureCard: true };
const FORCED_OPPONENT = { isOptional: false, subject: { isOpponent: true } };

export const RESOURCE_INSPECTIONS = [
    {
        id: 'discard-opponent',
        title: 'Makes opponents discard',
        group: 'Card flow',
        match: { kind: 'DiscardEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'mill-opponent',
        title: 'Mills opponents',
        group: 'Graveyard',
        match: { kind: 'MillEffect', isOptional: false, subject: { canBeOpponent: true } }
    },
    {
        id: 'tutor-nonland',
        title: 'Searches the library for a nonland card',
        group: 'Card flow',
        match: { kind: 'SearchLibraryEffect', toHand: true, findsLand: false }
    },
    {
        id: 'land-ramp',
        title: 'Puts lands from the library onto the battlefield',
        group: 'Mana & lands',
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
        group: 'Graveyard',
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
        group: 'Graveyard',
        match: {
            kind: 'ReturnEffect',
            destination: 'hand',
            fromGraveyard: true,
            phrases: CREATURE_CARD
        }
    }
];
