const CREATURES_INCLUDING_SELF = {
    hasType: 'creature',
    excludesSelf: false,
    controlledByOpponent: false,
    isBackReference: false,
    hasSubtypes: false,
    not: { hasExactType: 'token' }
};
const SOURCE_GONE = [
    { ability: { event: { kind: 'DiesEvent' } } },
    { ability: { cost: { removesSource: true } } }
];
const SOURCE_ON_BATTLEFIELD = { expansion: null, not: { any: SOURCE_GONE } };

export const CREATURE_CARD_INCLUDED = {
    card: { isCreature: true },
    context: SOURCE_ON_BATTLEFIELD
};

export function selfOrIncludingSelf(key) {
    return [
        { [key]: { refersToSelf: true } },
        { ...CREATURE_CARD_INCLUDED, [key]: CREATURES_INCLUDING_SELF }
    ];
}
