const OWN_ACTION = { context: { granted: false, expansion: null, parentEffect: null } };

function sacrificed(typeMatch) {
    return { refersToSelf: false, isBackReference: false, ...typeMatch };
}

function sacrificeOutlet(typeMatch) {
    return {
        any: [
            {
                kind: 'ActivatedAbility',
                ...OWN_ACTION,
                cost: { items: { kind: 'SacrificeCost', phrases: sacrificed(typeMatch) } }
            },
            {
                kind: 'SacrificeEffect',
                subjectIsYou: true,
                isDelayed: false,
                ...OWN_ACTION,
                phrases: { isMass: false, ...sacrificed(typeMatch) }
            }
        ]
    };
}

const LAND = { hasType: 'land' };
const PLAIN_TOKEN = { hasExactType: 'token', hasSubtypes: false };

const SELF_SACRIFICE = {
    card: { isInstantOrSorcery: false },
    ...OWN_ACTION,
    any: [
        { kind: 'SacrificeCost', phrases: { refersToSelf: true } },
        { kind: 'SacrificeEffect', subjectIsYou: true, phrases: { refersToSelf: true } }
    ]
};

const EACH_PLAYER_SACRIFICES = {
    kind: 'SacrificeEffect',
    subjectIsYou: false,
    affectsYou: true,
    phrases: { refersToSelf: false, isRemainder: false, isMass: false }
};
const DRAW_FOR_YOU = { kind: 'DrawEffect', drawsCards: true, subjectIsYou: true };

export const SACRIFICE_TAGS = [
    {
        tag: 'egg',
        match: {
            kind: 'SacrificeCost',
            phrases: { refersToSelf: true },
            context: {
                ...OWN_ACTION.context,
                card: { isArtifact: true, isCreature: false, isLand: false },
                ability: {
                    kind: 'ActivatedAbility',
                    body: {
                        sentences: { effects: DRAW_FOR_YOU }
                    }
                }
            }
        }
    },
    { tag: 'sacrifice-outlet-creature', match: sacrificeOutlet({ hasType: 'creature' }) },
    { tag: 'sacrifice-outlet-artifact', match: sacrificeOutlet({ hasType: 'artifact' }) },
    { tag: 'sacrifice-outlet-land', match: sacrificeOutlet(LAND) },
    { tag: 'sacrifice-outlet-token', match: sacrificeOutlet(PLAIN_TOKEN) },
    { tag: 'sacrifice-self', match: SELF_SACRIFICE },
    { tag: 'mutual-sacrifice', match: EACH_PLAYER_SACRIFICES },
    {
        tag: 'repeatable-sacrifice-outlet',
        match: {
            kind: 'ActivatedAbility',
            isRepeatable: true,
            context: { granted: false },
            cost: { sacrificesOther: true }
        }
    }
];
