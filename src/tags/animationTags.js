const LAND_ANIMATION = {
    kind: 'BecomesEffect',
    becomesCreature: true,
    context: { granted: false, expansion: null }
};

export const ANIMATION_TAGS = [
    {
        tag: 'animate-land',
        match: {
            ...LAND_ANIMATION,
            actingSubject: { refersToSelf: false, allowsTypeAlone: 'land' }
        }
    },
    {
        tag: 'creatureland',
        match: {
            ...LAND_ANIMATION,
            actingSubject: { refersToSelf: true },
            card: { isLand: true, isCreature: false }
        }
    }
];
