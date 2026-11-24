export const TURN_TAGS = [
    {
        tag: 'extra-turn',
        match: { kind: 'ExtraTurnEffect', context: { expansion: null } }
    },
    {
        tag: 'extra-combat-phase',
        match: { kind: 'AdditionalPhaseEffect', addsCombat: true }
    },
    {
        tag: 'cost-increaser',
        match: {
            kind: 'CostModificationEffect',
            reducesCost: false,
            subject: { refersToSelf: false, isBackReference: false }
        }
    }
];
