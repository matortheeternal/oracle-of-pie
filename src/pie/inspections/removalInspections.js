import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

const OPPOSING_CREATURE = {
    isOpposingObject: true,
    isBackReference: false,
    hasExactType: 'creature',
    not: { kind: 'AttachedReference' }
};
const DESTROY_OR_EXILE = ['DestroyEffect', 'ExileEffect'];

export const REMOVAL_INSPECTIONS = [
    {
        id: 'counterspell',
        title: 'Counters spells',
        group: 'Removal',
        tiers: ColorTiers.of(TERTIARY, PRIMARY, NONE, TERTIARY, TERTIARY),
        description: 'Blue owns countering. White taxes; red and green counter narrow '
            + 'spell types.',
        match: { kind: 'CounterEffect', phrases: { hasExactType: 'spell' } }
    },
    {
        id: 'destroy-creature',
        title: 'Destroys creatures',
        group: 'Removal',
        tiers: ColorTiers.of(SECONDARY, NONE, PRIMARY, NONE, NONE),
        description: 'Black destroys anything; white destroys conditionally.',
        match: {
            kind: 'DestroyEffect',
            phrases: { ...OPPOSING_CREATURE, requiresFlying: false }
        }
    },
    {
        id: 'exile-creature',
        title: 'Exiles creatures',
        group: 'Removal',
        tiers: ColorTiers.of(PRIMARY, TERTIARY, SECONDARY, NONE, NONE),
        description: 'White exiles, often temporarily. Black exiles less often than it '
            + 'destroys.',
        match: {
            kind: 'ExileEffect',
            isTemporary: false,
            duration: null,
            phrases: OPPOSING_CREATURE
        }
    },
    {
        id: 'bounce-creature',
        title: 'Returns creatures to hand',
        group: 'Removal',
        tiers: ColorTiers.of(TERTIARY, PRIMARY, TERTIARY, NONE, TERTIARY),
        description: 'Blue owns bounce. Other colors bounce their own creatures or '
            + 'with narrow conditions.',
        match: { kind: 'ReturnEffect', isBounce: true, phrases: OPPOSING_CREATURE }
    },
    {
        id: 'edict',
        title: 'Makes opponents sacrifice',
        group: 'Removal',
        tiers: ColorTiers.of(TERTIARY, NONE, PRIMARY, TERTIARY, TERTIARY),
        description: 'Black owns edicts. White edicts attackers; red and green rarely.',
        match: { kind: 'SacrificeEffect', subject: { isOpponent: true } }
    },
    {
        id: 'shrink-creature',
        title: 'Lowers toughness',
        group: 'Removal',
        tiers: ColorTiers.of(TERTIARY, TERTIARY, PRIMARY, NONE, NONE),
        description: 'Black owns -X/-X. Others shrink only power or slightly.',
        match: {
            any: [
                {
                    kind: 'ModifyPTEffect',
                    modifier: { lowersToughness: true },
                    subject: OPPOSING_CREATURE
                },
                {
                    kind: 'PutCountersEffect',
                    isMinusCounters: true,
                    phrases: OPPOSING_CREATURE
                }
            ]
        }
    },
    {
        id: 'destroy-artifact',
        title: 'Removes artifacts',
        group: 'Removal',
        tiers: ColorTiers.of(SECONDARY, TERTIARY, NONE, PRIMARY, PRIMARY),
        description: 'Red and green own artifact removal; white is secondary.',
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            phrases: { isOpposingObject: true, hasExactType: 'artifact' }
        }
    },
    {
        id: 'destroy-enchantment',
        title: 'Removes enchantments',
        group: 'Removal',
        tiers: ColorTiers.of(PRIMARY, TERTIARY, NONE, NONE, PRIMARY),
        description: 'White and green own enchantment removal.',
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            phrases: { isOpposingObject: true, hasExactType: 'enchantment' }
        }
    }
];
