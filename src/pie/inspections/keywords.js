import { allow, CREATURE_TYPE } from '../conditions/index.js';
import { LIFE_COST, NON_MANA_COST } from '../conditions/costConditions.js';

export const CANON_KEYWORDS = [
    'flying', 'first strike', 'double strike', 'deathtouch', 'haste', 'hexproof',
    'indestructible', 'lifelink', 'menace', 'reach', 'trample', 'vigilance',
    'defender', 'flash', 'ward', 'prowess'
];

export const KEYWORD_CITATIONS = {
    'ward': 'Ward (for mana)'
};

export const KEYWORD_EXCEPTIONS = {
    'ward': [allow(LIFE_COST, ['R'], 'Ward (for life)'), allow(NON_MANA_COST, ['B'])],
    'trample': [{ condition: CREATURE_TYPE.id, subtype: 'Demon', colors: ['B'] }]
};
