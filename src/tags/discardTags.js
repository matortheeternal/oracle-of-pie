const OWN_ACTION = { context: { granted: false, expansion: null } };
const DISCARD_COST = { kind: 'ActivatedAbility', cost: { discardsOtherCards: true } };

export const DISCARD_TAGS = [
    {
        tag: 'discard-outlet',
        match: {
            ...OWN_ACTION,
            any: [{ kind: 'DiscardEffect', subjectIsYou: true }, DISCARD_COST]
        }
    },
    {
        tag: 'free-discard-outlet',
        match: {
            ...OWN_ACTION,
            ...DISCARD_COST,
            limitsUses: false,
            cost: { discardsOtherCards: true, isOnlyDiscard: true }
        }
    }
];
