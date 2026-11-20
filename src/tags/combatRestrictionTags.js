const SOURCE_TEXT = { granted: false, expansion: null };
const DIRECT_COMBAT_BAN = {
    kind: 'CantEffect',
    isDirectBan: true,
    context: SOURCE_TEXT
};
const ENCHANTED_OBJECT = {
    isEnchanted: true,
    any: [{ hasType: 'creature' }, { hasType: 'permanent' }]
};
const OPPOSING_COMBATANT = {
    isOpposingObject: true,
    isBackReference: false,
    any: [{ hasType: 'creature' }, ENCHANTED_OBJECT]
};

export const COMBAT_RESTRICTION_TAGS = [
    {
        tag: 'prevent-blocker',
        match: {
            ...DIRECT_COMBAT_BAN,
            preventsBlocking: true,
            actingSubject: OPPOSING_COMBATANT
        }
    },
    {
        tag: 'prevent-attack',
        match: {
            ...DIRECT_COMBAT_BAN,
            preventsAttacking: true,
            actingSubject: OPPOSING_COMBATANT
        }
    },
    {
        tag: 'pacifism',
        match: {
            ...DIRECT_COMBAT_BAN,
            preventsAttackingAndBlocking: true,
            subject: ENCHANTED_OBJECT,
            duration: null,
            qualifier: null,
            context: { ...SOURCE_TEXT, condition: null }
        }
    },
    {
        tag: 'block-trigger',
        match: {
            kind: 'TriggeredAbility',
            context: { granted: false },
            events: { kind: ['BlocksEvent', 'BecomesBlockedEvent'] }
        }
    }
];
