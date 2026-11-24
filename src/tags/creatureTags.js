import { STATIC_GRANT } from './staticGrant.js';

const COMBAT_KEYWORDS = [
    'first strike', 'double strike', 'deathtouch', 'indestructible', 'lifelink',
    'menace', 'trample', 'vigilance', 'flying', 'reach', 'protection', 'infect',
    'wither', 'intimidate', 'fear', 'skulk', 'shadow', 'horsemanship', 'flanking',
    'banding'
];
const TRICK_TIMING = {
    card: { isInstant: true },
    context: { ability: { kind: 'SpellAbility' } }
};
const TRICK_SUBJECT = {
    hasType: 'creature',
    any: [{ isTargeted: true }, { isMass: true, controlledByYou: true }]
};
const TRICK_OBJECT = { any: [TRICK_SUBJECT, { resolved: TRICK_SUBJECT }] };
const SELF_DEATH_TRIGGER = {
    kind: 'TriggeredAbility',
    event: { kind: 'DiesEvent', isSelf: true }
};
const DEATH_RECOVERY_TRICK = {
    kind: 'GrantEffect',
    ...TRICK_TIMING,
    subject: TRICK_SUBJECT,
    quoted: { text: { abilities: SELF_DEATH_TRIGGER } }
};
const PUMP_COUNTERS_TRICK = {
    kind: 'PutCountersEffect',
    ...TRICK_TIMING,
    isPlusCounters: true,
    phrases: TRICK_OBJECT
};
const SHRINK_COUNTERS_REMOVAL_TRICK = {
    kind: 'RemoveCountersEffect',
    ...TRICK_TIMING,
    isMinusCounters: true,
    phrases: TRICK_OBJECT
};

export const CREATURE_TAGS = [
    {
        tag: 'lifegain',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                {
                    kind: 'GainLifeEffect',
                    subjectIsYou: true,
                    context: { not: { sentence: { replacesLifeGain: true } } }
                }
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
            subject: {
                isMass: true,
                isCommanderGroup: false,
                controlledByYou: true,
                hasType: 'creature'
            },
            context: STATIC_GRANT
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
            any: [
                {
                    kind: ['ModifyPTEffect', 'SetBasePTEffect'],
                    ...TRICK_TIMING,
                    subject: TRICK_SUBJECT,
                    not: { modifier: { isLethalShrink: true } }
                },
                {
                    kind: 'GrantEffect',
                    ...TRICK_TIMING,
                    subject: TRICK_SUBJECT,
                    any: COMBAT_KEYWORDS.map(name => ({ grantsKeyword: name }))
                },
                DEATH_RECOVERY_TRICK,
                PUMP_COUNTERS_TRICK,
                SHRINK_COUNTERS_REMOVAL_TRICK
            ]
        }
    },
    {
        tag: 'cda-power',
        match: { kind: 'DefinePTEffect', definesPower: true }
    },
    {
        tag: 'cda-toughness',
        match: { kind: 'DefinePTEffect', definesToughness: true }
    },
    {
        tag: 'clone',
        match: { kind: 'EntersAsCopyEffect', subject: { refersToSelf: true } }
    },
    {
        tag: 'phasing',
        match: { kind: 'PhaseEffect', phasesOut: true }
    }
];
