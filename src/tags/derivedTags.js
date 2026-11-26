import { PLUS_COUNTERS } from './boardTags.js';
import { STATIC_GRANT } from './staticGrant.js';

const REMOVAL = [
    'removal-destroy', 'removal-exile', 'removal-bounce', 'removal-sacrifice',
    'removal-toughness', 'burn-creature', 'removal-fight', 'one-sided-fight',
    'removal-tuck'
];
const ATTACHED_TARGET = {
    any: [
        { phrases: { isAttached: true } },
        { subject: { isAttached: true } },
        { phrases: { objectType: null, resolved: { isAttached: true } } }
    ]
};
const SINGLE_TARGET = { isTargeted: true, isMass: false };
const OPPONENTS_GROUP = { isMass: true, controlledByOpponent: true };
export const REPEATABLE_ABILITY = { isRepeatable: true, isUltimate: false };
const REPEATABLE_CONTEXT = {
    card: { isInstantOrSorcery: false },
    delayedTrigger: null,
    temporaryGrant: null
};
const REPEATABLE = { ...REPEATABLE_CONTEXT, ability: REPEATABLE_ABILITY };

const EXILE_ENCHANTED_OBJECT = {
    kind: 'ExileEffect',
    isTemporary: false,
    isOptional: false,
    phrases: { resolved: { kind: 'AttachedReference', isEnchanted: true } }
};
const TOKEN_FROM_EXILING_ENCHANTED_OBJECT = {
    card: { hasSubtype: 'Aura' },
    expansion: { isToken: true },
    origin: {
        previous: {
            isConditional: false,
            effects: EXILE_ENCHANTED_OBJECT
        }
    }
};

const OWN_ABILITY = { granted: false, expansion: null };
const COUNTERS_DEPLETED = /^if there are no \w+ counters? on /i;
const FINITE_COUNTERS = {
    ability: { cost: { removesCounters: true } },
    condition: { condition: COUNTERS_DEPLETED }
};
const MODE_NOT_USED_BEFORE = /\bhasn't been chosen\b(?! this turn)/i;
const ATTACHED_DEATH = { kind: 'DiesEvent', subjectPhrase: { isAttached: true } };
const UNKNOWN_ENTRANT = { kind: 'EntersEvent', subjectPhrase: null };
const SINGLE_USE_MODES = { kind: 'ChooseModesEffect', raw: MODE_NOT_USED_BEFORE };
export const REPEATABLE_SOURCE = {
    ...REPEATABLE_CONTEXT,
    ...OWN_ABILITY,
    any: [
        { ability: REPEATABLE_ABILITY },
        {
            ability: { kind: 'ModeLine', consumesSource: false },
            abilities: REPEATABLE_ABILITY
        }
    ],
    not: {
        any: [
            { sentence: { kind: 'ReplacementSentence' } },
            { sentence: { effects: { consumesSource: true, isOptional: false } } },
            { ability: { event: { any: [ATTACHED_DEATH, UNKNOWN_ENTRANT] } } },
            { abilities: { body: { effects: SINGLE_USE_MODES } } },
            FINITE_COUNTERS
        ]
    }
};
const REPEATABLE_TOKEN = {
    kind: 'CreateTokenEffect',
    affectsYou: true,
    context: REPEATABLE_SOURCE,
    not: {
        card: { hasSubtype: 'Aura' },
        context: {
            sentence: {
                any: [
                    { effects: EXILE_ENCHANTED_OBJECT },
                    { previous: { effects: EXILE_ENCHANTED_OBJECT } }
                ]
            }
        }
    }
};
const REPEATABLE_LIBRARY_ACTION = {
    kind: 'KeywordActionEffect',
    affectsYou: true,
    context: REPEATABLE_SOURCE
};
const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const LASTING_GRANT = { ...STATIC_GRANT, expansion: null };

export const DERIVED_TAGS = [
    {
        tag: 'removal-nonland',
        match: {
            tag: REMOVAL,
            phrases: {
                resolved: { excludesType: 'land', not: { excludesType: 'creature' } }
            }
        }
    },
    {
        tag: 'removal-planeswalker',
        match: { tag: REMOVAL, phrases: { hasType: 'planeswalker' } }
    },
    {
        tag: 'removal-land',
        match: { tag: REMOVAL, phrases: { hasExactType: 'land' } }
    },
    {
        tag: 'sweeper-one-sided',
        match: {
            tag: 'sweeper',
            any: [
                { phrases: OPPONENTS_GROUP },
                { subject: OPPONENTS_GROUP }
            ],
            not: { subject: { includesYou: true } }
        }
    },
    {
        tag: 'repeatable-pp-counters',
        match: {
            ...PLUS_COUNTERS,
            context: { ...REPEATABLE, expansion: null }
        }
    },
    {
        tag: 'repeatable-loot',
        match: { tag: 'loot', context: REPEATABLE }
    },
    {
        tag: 'repeatable-rummage',
        match: {
            tag: 'rummage',
            context: { ...REPEATABLE, not: TOKEN_FROM_EXILING_ENCHANTED_OBJECT }
        }
    },
    {
        tag: 'pinger',
        match: {
            kind: 'DamageEffect',
            isPing: true,
            phrases: { any: [{ hitsCreature: true }, { hitsPlayer: true }] },
            context: {
                ...REPEATABLE,
                not: {
                    sentence: { effects: { consumesSource: true, isOptional: false } }
                }
            }
        }
    },
    {
        tag: 'spot-removal',
        match: {
            any: [
                { tag: REMOVAL, phrases: SINGLE_TARGET },
                { tag: REMOVAL, subject: SINGLE_TARGET },
                {
                    tag: 'removal-sacrifice',
                    primaryObject: { isMass: false, isRemainder: false }
                },
                { tag: 'burn-any' }
            ]
        }
    },
    {
        tag: 'removal-creature',
        match: { tag: REMOVAL, phrases: { hasType: 'creature' } }
    },
    {
        tag: 'repeatable-removal',
        match: {
            tag: REMOVAL,
            context: REPEATABLE,
            not: ATTACHED_TARGET
        }
    },
    {
        tag: 'repeatable-recursion',
        match: {
            any: [
                { tag: 'regrowth' },
                { kind: 'ReturnEffect', destination: 'battlefield', fromGraveyard: true },
                { kind: 'PutEffect', toBattlefield: true, phrases: { zone: 'graveyard' } }
            ],
            context: REPEATABLE_SOURCE
        }
    },
    {
        tag: 'repeatable-pure-draw',
        match: { tag: 'pure-draw', context: REPEATABLE }
    },
    {
        tag: 'draw-engine',
        match: { tag: 'repeatable-pure-draw' }
    },
    {
        tag: 'repeatable-lifegain',
        match: {
            any: [
                { tag: 'lifegain', context: REPEATABLE },
                {
                    kind: 'KeywordAbility',
                    keywords: { names: 'lifelink' },
                    card: { isCreature: true },
                    context: OWN_ABILITY
                },
                {
                    kind: GRANTING_EFFECTS,
                    grantsKeyword: 'lifelink',
                    context: LASTING_GRANT
                },
                {
                    kind: 'CreateTokenEffect',
                    tokenDefinitions: { name: 'Food' },
                    affectsYou: true,
                    context: REPEATABLE
                }
            ]
        }
    },
    {
        tag: 'repeatable-creature-tokens',
        match: {
            kind: 'CreateTokenEffect',
            createsCreature: true,
            affectsYou: true,
            context: { ...REPEATABLE, not: FINITE_COUNTERS }
        }
    },
    {
        tag: 'repeatable-scry',
        match: { ...REPEATABLE_LIBRARY_ACTION, tag: 'scry' }
    },
    {
        tag: 'repeatable-surveil',
        match: { ...REPEATABLE_LIBRARY_ACTION, action: 'surveil' }
    },
    {
        tag: 'repeatable-treasures',
        match: { ...REPEATABLE_TOKEN, tokenDefinitions: { name: 'Treasure' } }
    },
    {
        tag: 'repeatable-artifact-tokens',
        match: {
            ...REPEATABLE_TOKEN,
            createsArtifact: true
        }
    }
];
