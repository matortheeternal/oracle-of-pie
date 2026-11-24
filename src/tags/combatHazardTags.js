const SOURCE_TEXT = { granted: false, expansion: null };
const ATTACKING_OPPONENT = /^attacking you$/i;
const BLOCKING_SOURCE = /^blocking (?:it|~|this creature)\b/i;

function combatHazard(state, relation) {
    return {
        kind: [
            'DamageEffect', 'DestroyEffect', 'ExileEffect', 'ReturnEffect',
            'TuckEffect', 'PutEffect'
        ],
        isComplete: true,
        context: SOURCE_TEXT,
        phrases: {
            kind: 'NounPhrase',
            isOpposingObject: true,
            hasType: 'creature',
            any: [{ hasQualifier: state }, { modifiers: { raw: relation } }]
        }
    };
}

export const COMBAT_HAZARD_TAGS = [
    { tag: 'hate-attacker', match: combatHazard('attacking', ATTACKING_OPPONENT) },
    { tag: 'hate-blocker', match: combatHazard('blocking', BLOCKING_SOURCE) },
    {
        tag: 'pillowfort',
        match: {
            kind: 'CantEffect', taxesAttacksOnController: true, context: SOURCE_TEXT
        }
    }
];
