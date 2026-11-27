import { allow } from '../conditions/index.js';
import {
    FLYING_CREATURES, COMBATANT_CREATURES, DEFENDER_CREATURES
} from '../conditions/targetConditions.js';
import {
    RANDOM_REPLACEMENT, TOKEN_REPLACEMENT
} from '../conditions/replacementConditions.js';

const OPPOSING_CREATURE = {
    isOpposingObject: true,
    isBackReference: false,
    hasExactType: 'creature',
    not: { any: [{ kind: 'AttachedReference' }, { hasTypeConjunction: 'land creature' }] }
};
const ABILITY_ONLY = { hasExactType: 'ability', not: { hasExactType: 'spell' } };
const OPPOSING_ABILITY = { ...ABILITY_ONLY, controlledByYou: false };
const COUNTERS_ABILITY = { kind: 'CounterEffect', phrases: ABILITY_ONLY };
const DESTROY_OR_EXILE = ['DestroyEffect', 'ExileEffect'];
const POLYMORPH = allow(RANDOM_REPLACEMENT, ['R'], '"Polymorph"');
const TOKEN_EXCHANGE = allow(TOKEN_REPLACEMENT, ['U']);
const FLYER_REMOVAL = allow(
    FLYING_CREATURES, ['G'], 'Destroy target creature with flying'
);
const COMBATANT_REMOVAL = allow(
    COMBATANT_CREATURES, ['W'], 'Destroy target attacking or blocking creature.'
);

export const REMOVAL_INSPECTIONS = [
    {
        id: 'counterspell',
        title: 'Counters spells',
        group: 'Removal',
        match: { tag: 'counterspell', not: COUNTERS_ABILITY }
    },
    {
        id: 'counter-ability',
        title: 'Counters abilities',
        group: 'Removal',
        cites: 'Counter target activated/triggered ability',
        match: { ...COUNTERS_ABILITY, phrases: OPPOSING_ABILITY }
    },
    {
        id: 'destroy-creature',
        title: 'Destroys creatures',
        group: 'Removal',
        exceptions: [
            POLYMORPH, TOKEN_EXCHANGE, allow(DEFENDER_CREATURES, ['R']), FLYER_REMOVAL,
            COMBATANT_REMOVAL
        ],
        match: {
            kind: 'DestroyEffect',
            phrases: OPPOSING_CREATURE
        }
    },
    {
        id: 'exile-creature',
        title: 'Exiles creatures',
        group: 'Removal',
        exceptions: [POLYMORPH, TOKEN_EXCHANGE, allow(FLYING_CREATURES, ['G'])],
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
        match: { kind: 'ReturnEffect', isBounce: true, phrases: OPPOSING_CREATURE }
    },
    {
        id: 'edict',
        title: 'Makes opponents sacrifice',
        group: 'Removal',
        exceptions: [FLYER_REMOVAL, COMBATANT_REMOVAL],
        match: {
            kind: 'SacrificeEffect',
            isOptional: false,
            subject: { canBeOpponent: true },
            phrases: { hasType: 'creature', isMass: false, isRemainder: false }
        }
    },
    {
        id: 'shrink-creature',
        title: 'Lowers toughness',
        group: 'Removal',
        exceptions: [FLYER_REMOVAL],
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
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            not: { isTemporary: true },
            phrases: { isOpposingObject: true, hasExactType: 'artifact' }
        }
    },
    {
        id: 'destroy-enchantment',
        title: 'Removes enchantments',
        group: 'Removal',
        match: {
            kind: DESTROY_OR_EXILE,
            duration: null,
            not: { isTemporary: true },
            phrases: { isOpposingObject: true, hasExactType: 'enchantment' }
        }
    }
];
