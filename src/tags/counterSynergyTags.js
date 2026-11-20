const SOURCE_TEXT = { granted: false, expansion: null };
const GENERIC_COUNTERS = /^(?:one or more )?counters on (?:it|them)$/;
const MINUS_COUNTERS = /^(?:an? |one or more )?-1\/-1 counters? on (?:it|them)$/;
const PLUS_COUNTERS = /^(?:an? |one or more )?\+1\/\+1 counters? on (?:it|them)$/;

function counterPlacement(counterKind) {
    return {
        kind: ['CountersPutEvent', 'PlacesCountersEvent'],
        counters: { isThreshold: false, counterKind },
        recipient: { isRecognized: true }
    };
}

function existingCounters(property) {
    return { kind: 'WithModifier', negated: false, property };
}

export const COUNTER_SYNERGY_TAGS = [
    {
        tag: 'counters-matter',
        match: {
            context: SOURCE_TEXT,
            any: [
                counterPlacement([null, '-1/-1']),
                existingCounters(GENERIC_COUNTERS),
                existingCounters(MINUS_COUNTERS),
                { kind: 'CountersOnCondition', counterKind: [null, '-1/-1'] }
            ]
        }
    },
    {
        tag: 'pp-counters-matter',
        match: {
            context: SOURCE_TEXT,
            any: [
                counterPlacement('+1/+1'),
                existingCounters(PLUS_COUNTERS)
            ]
        }
    },
    {
        tag: 'counter-doubler',
        match: {
            any: [
                {
                    kind: 'DoubleCountersEffect',
                    any: [
                        { not: { phrases: { kind: 'SelfReference' } } },
                        { counterKind: '+1/+1', context: SOURCE_TEXT }
                    ]
                },
                {
                    kind: 'CounterModificationEffect',
                    modification: 'twice that many',
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'pridemate',
        match: {
            kind: 'PutCountersEffect',
            isPlusCounters: true,
            context: {
                ...SOURCE_TEXT,
                ability: {
                    kind: 'TriggeredAbility',
                    events: { kind: 'GainsLifeEvent', isYou: true }
                }
            }
        }
    }
];
