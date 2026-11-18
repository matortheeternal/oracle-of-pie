import { STATIC_GRANT } from './staticGrant.js';

const REMOVAL = [
    'removal-destroy', 'removal-exile', 'removal-bounce', 'removal-sacrifice',
    'removal-toughness', 'burn-creature', 'removal-fight', 'one-sided-fight',
    'removal-tuck'
];
const REPEATABLE = {
    ability: { isRepeatable: true },
    delayedTrigger: null,
    temporaryGrant: null
};

const OWN_ABILITY = { granted: false, expansion: null };
const GRANTING_EFFECTS = ['GrantEffect', 'ModifyPTEffect'];
const LASTING_GRANT = { ...STATIC_GRANT, expansion: null };

export const DERIVED_TAGS = [
    {
        tag: 'spot-removal',
        match: { tag: REMOVAL, phrases: { isTargeted: true, isMass: false } }
    },
    {
        tag: 'removal-creature',
        match: { tag: REMOVAL, phrases: { hasType: 'creature' } }
    },
    {
        tag: 'repeatable-removal',
        match: { tag: REMOVAL, context: REPEATABLE }
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
