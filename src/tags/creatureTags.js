
export const CREATURE_TAGS = [
    {
        tag: 'lifegain',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    },
    {
        tag: 'tapper-creature',
        match: {
            kind: 'TapEffect',
            phrases: { isOpposingObject: true, hasType: 'creature' }
        }
    },
    {
        tag: 'threaten',
        match: {
            kind: 'GainControlEffect',
            duration: { isUntilEndOfTurn: true },
            phrases: { any: [{ hasType: 'creature' }, { hasType: 'permanent' }] }
        }
    },
    {
        tag: 'anthem',
        match: {
            kind: 'ModifyPTEffect',
            modifier: { isPowerBoost: true },
            duration: null,
            subject: { isMass: true, controlledByYou: true, hasType: 'creature' }
        }
    },
    {
        tag: 'flicker-creature',
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    },
    {
        tag: 'combat-trick',
        match: {
            kind: ['ModifyPTEffect', 'GrantEffect'],
            card: { isInstant: true },
            subject: { isTargeted: true, controlledByYou: true },
            context: { ability: { kind: 'SpellAbility' } }
        }
    },
    {
        tag: 'cda-power',
        match: { kind: 'DefinePTEffect', definesPower: true }
    },
    {
        tag: 'cda-toughness',
        match: { kind: 'DefinePTEffect', definesToughness: true }
    }
];
