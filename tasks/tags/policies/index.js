import ExtraTagPolicy from './ExtraTagPolicy.js';
import OmittedTagPolicy from './OmittedTagPolicy.js';

const NONCOMBAT_GRANTS = ['hexproof', 'shroud', 'ward', 'haste'];
const COMBAT_KEYWORDS = [
    'first strike', 'double strike', 'deathtouch', 'indestructible', 'lifelink',
    'menace', 'trample', 'vigilance', 'flying', 'reach', 'protection'
];
const CHARACTERISTIC_TAGS = [
    'triggered-ability', 'activated-ability', 'french-vanilla', 'death-trigger',
    'death-trigger-self', 'attack-trigger', 'cast-trigger-you', 'intervening-if-clause',
    'mana-dork', 'unblockable', 'gains-pp-counters'
];
const COMBAT_GRANTS = COMBAT_KEYWORDS.map(name => ({ grantsKeyword: name }));
const COMBAT_CHANGES = [
    'ModifyPTEffect', 'SetBasePTEffect', 'PutCountersEffect', 'RemoveCountersEffect',
    'PreventDamageEffect'
];
const GRANTED_TRIGGER = { text: { abilities: { kind: 'TriggeredAbility' } } };

export const TAG_POLICIES = [
    new ExtraTagPolicy({
        id: 'granted-abilities',
        title: 'Effect tags count abilities a card grants to other objects',
        exceptTags: CHARACTERISTIC_TAGS,
        match: { context: { granted: true } },
        examples: [
            { card: 'Devils\' Playground', tag: 'burn-any' },
            { card: 'Way of the Cryomancer', tag: 'copy-spell' }
        ]
    }),
    new ExtraTagPolicy({
        id: 'combat-trick-stats',
        title: 'Combat tricks include counter changes and death triggers',
        tags: ['combat-trick'],
        match: {
            any: [
                { kind: ['PutCountersEffect', 'RemoveCountersEffect'] },
                { kind: 'GrantEffect', quoted: GRANTED_TRIGGER }
            ]
        },
        examples: [
            { card: 'Hapatra\'s Mark', tag: 'combat-trick' },
            { card: 'Snakeskin Veil', tag: 'combat-trick' },
            { card: 'Feign Death', tag: 'combat-trick' },
            { card: 'Undying Malice', tag: 'combat-trick' }
        ]
    }),
    new OmittedTagPolicy({
        id: 'combat-trick-noncombat-grants',
        title: 'Granting only hexproof, shroud, ward or haste is not a combat trick',
        tags: ['combat-trick'],
        match: {
            kind: 'GrantEffect',
            card: { isInstant: true },
            any: NONCOMBAT_GRANTS.map(name => ({ grantsKeyword: name }))
        },
        unless: {
            any: [
                { kind: COMBAT_CHANGES },
                { kind: 'GrantEffect', any: COMBAT_GRANTS }
            ]
        },
        examples: [
            { card: 'You See a Guard Approach', tag: 'combat-trick' },
            { card: 'Expedite', tag: 'combat-trick' }
        ]
    })
];

const POLICIES_BY_ID = new Map(TAG_POLICIES.map(policy => [policy.id, policy]));

export function policyById(id) {
    return POLICIES_BY_ID.get(id);
}
