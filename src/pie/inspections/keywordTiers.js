import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';
import { NON_MANA_WARD, DEMON_TRAMPLE } from './exceptions.js';

export const KEYWORD_TIERS = {
    'flying': ColorTiers.of(PRIMARY, PRIMARY, SECONDARY, SECONDARY, TERTIARY),
    'first strike': ColorTiers.of(PRIMARY, NONE, TERTIARY, PRIMARY, NONE),
    'double strike': ColorTiers.of(SECONDARY, NONE, NONE, PRIMARY, TERTIARY),
    'deathtouch': ColorTiers.of(NONE, NONE, PRIMARY, TERTIARY, PRIMARY),
    'haste': ColorTiers.of(NONE, NONE, SECONDARY, PRIMARY, SECONDARY),
    'hexproof': ColorTiers.of(SECONDARY, SECONDARY, NONE, NONE, PRIMARY),
    'indestructible': ColorTiers.of(PRIMARY, NONE, SECONDARY, TERTIARY, SECONDARY),
    'lifelink': ColorTiers.of(PRIMARY, NONE, PRIMARY, NONE, TERTIARY),
    'menace': ColorTiers.of(NONE, NONE, PRIMARY, PRIMARY, TERTIARY),
    'reach': ColorTiers.of(NONE, NONE, NONE, SECONDARY, PRIMARY),
    'trample': ColorTiers.of(NONE, NONE, TERTIARY, SECONDARY, PRIMARY),
    'vigilance': ColorTiers.of(PRIMARY, SECONDARY, NONE, TERTIARY, SECONDARY),
    'defender': ColorTiers.of(PRIMARY, PRIMARY, SECONDARY, SECONDARY, SECONDARY),
    'flash': ColorTiers.of(SECONDARY, PRIMARY, SECONDARY, SECONDARY, SECONDARY),
    'ward': ColorTiers.of(SECONDARY, PRIMARY, TERTIARY, TERTIARY, SECONDARY),
    'prowess': ColorTiers.of(TERTIARY, PRIMARY, NONE, PRIMARY, NONE)
};

export const KEYWORD_EXCEPTIONS = {
    'ward': [NON_MANA_WARD],
    'trample': [DEMON_TRAMPLE]
};
