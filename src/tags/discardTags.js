const OWN_ACTION = { context: { granted: false, expansion: null } };
export const DEFECTOR = {
    cardText: {
        effects: {
            kind: 'EntersUnderOpponentControlEffect',
            subject: { refersToSelf: true }
        }
    }
};

const DISCARD_COST = { kind: 'ActivatedAbility', cost: { discardsOtherCards: true } };

export const DISCARD_TAGS = [
    {
        tag: 'discard-outlet',
        match: {
            context: {
                ...OWN_ACTION.context,
                not: DEFECTOR
            },
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
