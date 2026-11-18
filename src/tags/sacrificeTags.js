function sacrificed(type) {
    return { refersToSelf: false, hasType: type };
}

function sacrificeOutlet(type) {
    return {
        kind: 'ActivatedAbility',
        context: { granted: false },
        cost: { items: { kind: 'SacrificeCost', phrases: sacrificed(type) } }
    };
}

export const SACRIFICE_TAGS = [
    {
        tag: 'sacrifice-outlet-creature',
        match: sacrificeOutlet('creature')
    },
    {
        tag: 'sacrifice-outlet-artifact',
        match: sacrificeOutlet('artifact')
    },
    {
        tag: 'repeatable-sacrifice-outlet',
        match: {
            kind: 'ActivatedAbility',
            context: { granted: false },
            cost: { sacrificesOther: true }
        }
    }
];
