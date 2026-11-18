export const COUNTER_TAGS = [
    {
        tag: 'move-counters',
        match: {
            any: [
                { kind: 'MoveCountersEffect' },
                { kind: 'PutCountersEffect', movesCounters: true }
            ]
        }
    },
    {
        tag: 'remove-counters',
        match: {
            context: { expansion: null },
            any: [
                {
                    kind: 'RemoveCountersEffect',
                    phrases: { refersToSelf: false, isBackReference: false }
                },
                { kind: 'ActivatedAbility', cost: { removesCounters: true } }
            ]
        }
    }
];
