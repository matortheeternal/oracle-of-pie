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
    {
        tag: 'refund',
        match: {
            kind: 'UntapEffect',
            phrases: { hasExactType: 'land' },
            context: {
                ability: { kind: 'SpellAbility' },
                sentence: { previous: { effects: { kind: 'CounterEffect' } } },
                granted: false,
                expansion: null
            }
        }
    },
    { tag: 'freeze-creature', match: freeze({ hasType: 'creature' }) },
    { tag: 'freeze-artifact', match: freeze({ hasExactType: 'artifact' }) },
    {
        tag: 'lockdown',
        match: {
            kind: 'CantEffect',
            preventsRecurringUntap: true,
            actingSubject: {
                any: [
                    { isAttached: true },
                    {
                        isBackReference: true,
                        antecedent: {
                            any: [
                                { isAttached: true },
                                { isTargeted: true, isPermanentObject: true }
                            ]
                        }
                    }
                ]
            },
            context: { granted: false, expansion: null }
        }
    },
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
