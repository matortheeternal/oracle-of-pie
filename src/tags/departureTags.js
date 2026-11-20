const SOURCE_TEXT = { granted: false, expansion: null };
const SOURCE_DEATH = {
    ...SOURCE_TEXT,
    delayedTrigger: null,
    ability: {
        kind: 'TriggeredAbility',
        event: { kind: 'DiesEvent', isSelf: true, unreadSubject: null, unreadText: null }
    }
};
const BOUNCE = {
    kind: 'ReturnEffect',
    isBounce: true,
    context: SOURCE_TEXT
};
const DIES = { kind: 'DiesEvent' };
const DEATH = { kind: 'DiesEvent', isSelf: true };
const OWN_CREATURE = {
    controlledByYou: true,
    refersToSelf: false,
    isCardInZone: false,
    allowsTypeAlone: 'creature',
    not: { hasType: 'spell' }
};

function printedKeyword(names) {
    return {
        kind: 'Keyword',
        name: names,
        context: { ...SOURCE_TEXT, ability: { kind: 'KeywordAbility' } }
    };
}

export const DEPARTURE_TAGS = [
    {
        tag: 'bounce-self',
        match: {
            any: [
                {
                    kind: 'ReturnEffect',
                    card: { isInstantOrSorcery: false },
                    context: { ...SOURCE_TEXT, not: { ability: { events: DEATH } } },
                    bouncesSource: true
                },
                {
                    kind: 'ReturnCost',
                    returnsToHand: true,
                    removesSource: true,
                    context: SOURCE_TEXT
                },
                printedKeyword('dash')
            ]
        }
    },
    {
        tag: 'rescue-creature',
        match: {
            any: [
                {
                    ...BOUNCE,
                    context: { ...SOURCE_TEXT, not: { ability: { events: DIES } } },
                    phrases: OWN_CREATURE
                },
                printedKeyword(['ninjutsu', 'commander ninjutsu', 'beam me up', 'sneak'])
            ]
        }
    },
    {
        tag: 'leaves-body-behind',
        match: {
            kind: 'CreateTokenEffect',
            subjectIsYou: true,
            card: { isCreature: true },
            context: SOURCE_DEATH,
            any: [
                { createsCreature: true },
                { copiesExplicitSource: true },
                { copiesIt: true }
            ]
        }
    }
];
