const NOT_SELF = { refersToSelf: false };

export const CREATURE_INSPECTIONS = [
    {
        id: 'tap-creature',
        title: 'Taps opposing creatures',
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
        match: { kind: 'GainControlEffect', duration: null }
    },
    {
        id: 'threaten',
        title: 'Gains control until end of turn',
        match: { kind: 'GainControlEffect', duration: { isUntilEndOfTurn: true } }
    },
    {
        id: 'grant-flying',
        title: 'Gives other creatures flying',
        match: {
            any: [
                { kind: 'GrantEffect', grantsKeyword: 'flying', subject: NOT_SELF },
                {
                    kind: 'ModifyPTEffect',
                    keywords: { names: 'flying' },
                    subject: NOT_SELF
                }
            ]
        }
    },
    {
        id: 'flicker',
        title: 'Exiles and returns creatures',
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    },
    {
        id: 'gain-life',
        title: 'Gains life',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    }
];
