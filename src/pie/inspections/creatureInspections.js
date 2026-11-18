const OPPOSING_OBJECT = { isOpposingObject: true };

export const CREATURE_INSPECTIONS = [
    {
        id: 'tap-creature',
        title: 'Taps opposing creatures',
        group: 'Control',
        match: {
            kind: 'TapEffect',
            phrases: {
                isOpposingObject: true,
                isBackReference: false,
                hasExactType: 'creature',
                not: { kind: 'AttachedReference' }
            }
        }
    },
    {
        id: 'steal-permanently',
        title: 'Gains control permanently',
        group: 'Control',
        match: { kind: 'GainControlEffect', duration: null, phrases: OPPOSING_OBJECT }
    },
    {
        id: 'threaten',
        title: 'Gains control until end of turn',
        group: 'Control',
        match: {
            kind: 'GainControlEffect',
            duration: { isUntilEndOfTurn: true },
            phrases: OPPOSING_OBJECT
        }
    },
    {
        id: 'flicker',
        title: 'Exiles and returns creatures',
        group: 'Protection',
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    },
    {
        id: 'gain-life',
        title: 'Gains life',
        group: 'Life',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    }
];
