const GRAVEYARD = 'graveyard';
const CREATURE_CARD = { isCreatureCard: true, allowsTypeAlone: 'creature' };
const NONLAND_PERMANENT = {
    kind: 'NounPhrase',
    hasExactType: 'permanent',
    excludesType: 'land'
};
const PERMANENT_CARD = {
    kind: 'NounPhrase',
    hasExactType: 'permanent',
    not: { any: [NONLAND_PERMANENT, { hasQualifier: 'historic' }] }
};
const SELF = { kind: 'SelfReference', zone: GRAVEYARD };
const MASS = { kind: 'NounPhrase', isMass: true, zone: GRAVEYARD };
const YOUR_CONTROL_TEXT = /\bunder your control\b/i;
const UNDER_YOUR_CONTROL = { raw: YOUR_CONTROL_TEXT };

function typed(type) {
    return { kind: 'NounPhrase', hasExactType: type, allowsTypeAlone: type };
}

function graveyardReturn(tag, destination, phrases, extra) {
    const returns = {
        kind: 'ReturnEffect', destination, fromGraveyard: true, phrases, ...extra
    };
    const puts = {
        kind: 'PutEffect',
        toBattlefield: true,
        phrases: { zone: GRAVEYARD, ...phrases },
        ...extra
    };
    const match = destination === 'battlefield' ? { any: [returns, puts] } : returns;
    return { tag, match };
}

function reanimate(tag, phrases, extra) {
    return graveyardReturn(tag, 'battlefield', phrases, extra);
}

function regrowth(tag, phrases) {
    return graveyardReturn(tag, 'hand', phrases);
}

function graveyardOwnedBy(owner) {
    return {
        kind: 'NounPhrase',
        modifiers: { kind: 'ZoneModifier', zone: GRAVEYARD, owner }
    };
}

export const GRAVEYARD_RETURN_TAGS = [
    reanimate('reanimate-creature', CREATURE_CARD),
    regrowth('regrowth-creature', CREATURE_CARD),
    ...['artifact', 'enchantment', 'land', 'planeswalker'].map(type =>
        reanimate(`reanimate-${type}`, typed(type))),
    ...['artifact', 'enchantment', 'land', 'planeswalker', 'instant', 'sorcery']
        .map(type => regrowth(`regrowth-${type}`, typed(type))),
    reanimate('reanimate-artifact-creature', {
        kind: 'NounPhrase', hasTypeConjunction: 'artifact creature'
    }),
    reanimate('reanimate-permanent', PERMANENT_CARD),
    reanimate('reanimate-nonland', {
        ...NONLAND_PERMANENT, not: { excludesType: 'creature' }
    }),
    regrowth('regrowth-permanent', PERMANENT_CARD),
    regrowth('regrowth-nonland-permanent', NONLAND_PERMANENT),
    reanimate('reanimate-self', SELF),
    regrowth('regrowth-self', SELF),
    reanimate('mass-reanimation', MASS),
    regrowth('mass-regrowth', MASS),
    reanimate(
        'reanimate-from-any',
        graveyardOwnedBy(['a', 'a single', 'any']),
        UNDER_YOUR_CONTROL
    ),
    reanimate(
        'reanimate-from-opponent',
        graveyardOwnedBy(['an opponent\'s', 'target opponent\'s']),
        UNDER_YOUR_CONTROL
    )
];
