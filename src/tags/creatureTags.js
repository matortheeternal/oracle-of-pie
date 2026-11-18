import { STATIC_GRANT } from './staticGrant.js';

export const CREATURE_TAGS = [
    {
        tag: 'lifegain',
        match: {
            any: [
                { kind: 'KeywordAbility', keywords: { names: 'lifelink' } },
                { kind: 'GainLifeEffect', subjectIsYou: true }
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
            kind: ['ModifyPTEffect', 'GrantEffect', 'SetBasePTEffect'],
            card: { isInstant: true },
            context: { ability: { kind: 'SpellAbility' } },
            subject: {
                hasType: 'creature',
                any: [{ isTargeted: true }, { isMass: true, controlledByYou: true }]
            },
            not: { modifier: { isLethalShrink: true } }
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
