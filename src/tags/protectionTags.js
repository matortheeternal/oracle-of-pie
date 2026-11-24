const SOURCE_TEXT = { granted: false, expansion: null };
const INNATE_DEFENSE = /^(?:hexproof|indestructible|protection|shroud|ward)$/;
const DEATH_RETURN_KEYWORD = /^(?:persist|undying)$/;
const PROTECTIVE_GRANT = {
    kind: ['GrantEffect', 'ModifyPTEffect'],
    any: ['hexproof', 'indestructible', 'protection'].map(name => ({
        grantedKeywordNames: name
    })),
    context: SOURCE_TEXT
};
const TEMPORARY_GRANT = {
    ...PROTECTIVE_GRANT,
    duration: { isUntilEndOfTurn: true }
};
const TARGET_CREATURE = { isTargeted: true, hasType: 'creature', refersToSelf: false };
const OWN_GROUP = { isMass: true, controlledByYou: true, isPlayer: false };
const SELF = { refersToSelf: true };
const PHASE_OUT = { kind: 'PhaseEffect', phasesOut: true, context: SOURCE_TEXT };
const DEATH_ABILITY = { kind: 'TriggeredAbility', events: { kind: 'DiesEvent' } };
const DEATH_RETURN = { kind: 'ReturnEffect', destination: ['battlefield', 'hand'] };
const SELF_DEATH_RETURN = {
    ...DEATH_RETURN,
    phrases: SELF,
    context: {
        ...SOURCE_TEXT,
        ability: { ...DEATH_ABILITY, events: { kind: 'DiesEvent', isSelf: true } }
    }
};
const DAMAGE_PREVENTION = {
    kind: 'PreventDamageEffect', isAll: true, context: SOURCE_TEXT
};
const CREATURE_GROUP = '(?:other )?(?:attacking )?(?:artifact )?creatures';
const TO_CREATURES = new RegExp(
    `^(?:this turn )?to (?:you and )?(?:target creature|${CREATURE_GROUP})`
    + '(?: you control)?(?: this turn)?$', 'i'
);
const CREATURE_SOURCE = 'enchanted creature|blocking creatures|up to one target creature';
const FROM_CREATURES = new RegExp(`^by (?:${CREATURE_SOURCE})\\b`, 'i');
const ALL_ATTACKERS = { isMass: true, hasType: 'creature', hasQualifier: 'attacking' };

export const PROTECTION_TAGS = [
    {
        tag: 'protects-self',
        match: {
            any: [
                {
                    kind: 'KeywordAbility',
                    keywords: { keywords: { name: INNATE_DEFENSE } },
                    context: SOURCE_TEXT
                },
                { ...PROTECTIVE_GRANT, subject: SELF },
                { ...PHASE_OUT, subject: SELF }
            ]
        }
    },
    {
        tag: 'protects-creature',
        match: {
            any: [
                { ...TEMPORARY_GRANT, subject: TARGET_CREATURE },
                { ...PHASE_OUT, subject: { ...TARGET_CREATURE, controlledByYou: true } }
            ]
        }
    },
    {
        tag: 'protects-all',
        match: {
            any: [
                { ...TEMPORARY_GRANT, subject: OWN_GROUP },
                { ...PHASE_OUT, subject: OWN_GROUP }
            ]
        }
    },
    {
        tag: 'damage-prevention',
        match: {
            ...DAMAGE_PREVENTION,
            any: [{ scope: TO_CREATURES }, { scope: FROM_CREATURES }]
        }
    },
    {
        tag: 'damage-prevention-creature',
        match: { ...DAMAGE_PREVENTION, scope: TO_CREATURES }
    },
    {
        tag: 'pseudo-fog',
        match: {
            any: [
                { kind: 'EndTurnOrCombatEffect' },
                { kind: ['ExileEffect', 'DestroyEffect'], phrases: ALL_ATTACKERS },
                { kind: 'ReturnEffect', isBounce: true, phrases: ALL_ATTACKERS }
            ],
            card: { isInstant: true },
            context: SOURCE_TEXT
        }
    },
    {
        tag: 'cheat-death',
        match: {
            ...DEATH_RETURN,
            phrases: {
                isBackReference: true,
                refersToSelf: false,
                antecedent: { isPermanentObject: true, owner: null }
            },
            context: { ...SOURCE_TEXT, ability: DEATH_ABILITY, delayedTrigger: null }
        }
    },
    {
        tag: 'cheat-death-self',
        match: {
            any: [
                SELF_DEATH_RETURN,
                {
                    kind: 'KeywordAbility',
                    keywords: { keywords: { name: DEATH_RETURN_KEYWORD } },
                    context: SOURCE_TEXT
                }
            ]
        }
    }
];
