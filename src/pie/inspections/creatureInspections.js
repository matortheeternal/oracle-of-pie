import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

const NOT_SELF = { refersToSelf: false };

export const CREATURE_INSPECTIONS = [
    {
        id: 'tap-creature',
        title: 'Taps opposing creatures',
        group: 'Control',
        tiers: ColorTiers.of(PRIMARY, PRIMARY, NONE, TERTIARY, NONE),
        description: 'White and blue tap creatures.',
        match: {
            kind: 'TapEffect',
            phrases: {
                isOpposingObject: true,
                isBackReference: false,
                hasExactType: 'creature',
                not: { kind: 'AttachedReference' }
            }
        }
    },
    {
        id: 'steal-permanently',
        title: 'Gains control permanently',
        group: 'Control',
        tiers: ColorTiers.of(NONE, PRIMARY, TERTIARY, NONE, NONE),
        description: 'Blue owns permanent theft.',
        match: { kind: 'GainControlEffect', duration: null }
    },
    {
        id: 'threaten',
        title: 'Gains control until end of turn',
        group: 'Control',
        tiers: ColorTiers.of(NONE, TERTIARY, TERTIARY, PRIMARY, NONE),
        description: 'Red owns temporary theft.',
        match: { kind: 'GainControlEffect', duration: { isUntilEndOfTurn: true } }
    },
    {
        id: 'grant-flying',
        title: 'Gives other creatures flying',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(PRIMARY, PRIMARY, SECONDARY, TERTIARY, NONE),
        description: 'White and blue give flying; green gives reach instead.',
        match: {
            any: [
                { kind: 'GrantEffect', grantsKeyword: 'flying', subject: NOT_SELF },
                {
                    kind: 'ModifyPTEffect',
                    keywords: { names: 'flying' },
                    subject: NOT_SELF
                }
            ]
        }
    },
    {
        id: 'flicker',
        title: 'Exiles and returns creatures',
        group: 'Protection',
        tiers: ColorTiers.of(PRIMARY, SECONDARY, NONE, NONE, NONE),
        description: 'White owns flicker; blue is secondary.',
        match: {
            kind: 'ExileEffect',
            isTemporary: true,
            phrases: { hasType: 'creature' }
        }
    },
    {
        id: 'gain-life',
        title: 'Gains life',
        group: 'Life',
        tiers: ColorTiers.of(PRIMARY, TERTIARY, SECONDARY, TERTIARY, PRIMARY),
        description: 'White and green gain life; black drains.',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
            ]
        }
    }
];
