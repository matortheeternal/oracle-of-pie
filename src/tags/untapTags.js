function frozen(typeMatch) {
    return { any: [typeMatch, { antecedent: typeMatch }] };
}

function freeze(typeMatch) {
    return {
        any: [
            { kind: 'CantEffect', preventsNextUntap: true, subject: frozen(typeMatch) },
            {
                kind: 'PutCountersEffect',
                isStunCounter: true,
                phrases: { refersToSelf: false, ...typeMatch }
            }
        ]
    };
}

export const UNTAP_TAGS = [
    { tag: 'freeze-creature', match: freeze({ hasType: 'creature' }) },
    { tag: 'freeze-artifact', match: freeze({ hasExactType: 'artifact' }) },
    {
        tag: 'extra-untap',
        match: {
            kind: 'UntapEffect',
            phrases: {
                isMass: true,
                controlledByYou: true,
                hasSubtypes: false,
                isRelativeGroup: false,
                not: { hasQualifier: 'other' }
            }
        }
    }
];
