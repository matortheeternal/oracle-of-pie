import { LIFE_WARD, NON_MANA_WARD, DEMON_TRAMPLE } from './exceptions.js';

export const CANON_KEYWORDS = [
    'flying', 'first strike', 'double strike', 'deathtouch', 'haste', 'hexproof',
    'indestructible', 'lifelink', 'menace', 'reach', 'trample', 'vigilance',
    'defender', 'flash', 'ward', 'prowess'
];

export const KEYWORD_EXCEPTIONS = {
    'ward': [LIFE_WARD, NON_MANA_WARD],
    'trample': [DEMON_TRAMPLE]
};
