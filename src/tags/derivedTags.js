import { STATIC_GRANT } from './staticGrant.js';

const REMOVAL = [
    'removal-destroy', 'removal-exile', 'removal-bounce', 'removal-sacrifice',
    'removal-toughness', 'burn-creature', 'removal-fight', 'one-sided-fight',
    'removal-tuck'
];
const ATTACHED_TARGET = {
    any: [{ phrases: { isAttached: true } }, { subject: { isAttached: true } }]
};
const SINGLE_TARGET = { isTargeted: true, isMass: false };
const REPEATABLE = {
    card: { isInstantOrSorcery: false },
    ability: { isRepeatable: true, isUltimate: false },
    delayedTrigger: null,
    temporaryGrant: null
};

const OWN_ABILITY = { granted: false, expansion: null };
const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const LASTING_GRANT = { ...STATIC_GRANT, expansion: null };

export const DERIVED_TAGS = [
    {
        tag: 'repeatable-pp-counters',
        match: {
            tag: ['gives-pp-counters', 'gains-pp-counters'],
            context: { ...REPEATABLE, expansion: null }
        }
    },
    {
        tag: 'repeatable-loot',
        match: { tag: 'loot', context: REPEATABLE }
    },
    {
        tag: 'repeatable-rummage',
        match: { tag: 'rummage', context: REPEATABLE }
    },
    {
        tag: 'pinger',
        match: {
            kind: 'DamageEffect',
            isPing: true,
            phrases: { any: [{ hitsCreature: true }, { hitsPlayer: true }] },
            context: REPEATABLE
        }
    },
    {
        tag: 'spot-removal',
        match: {
            any: [
                { tag: REMOVAL, phrases: SINGLE_TARGET },
                { tag: REMOVAL, subject: SINGLE_TARGET },
                { tag: 'removal-sacrifice', primaryObject: { isMass: false } },
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
            context: REPEATABLE
        }
    }
];
