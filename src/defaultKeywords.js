import KEYWORD_CANON from './pie/keywordCanon.json' with { type: 'json' };

const PRINTED_KEYWORDS = [
    'Flying', 'First strike', 'Double strike', 'Deathtouch', 'Defender', 'Haste',
    'Hexproof', 'Indestructible', 'Lifelink', 'Menace', 'Reach', 'Trample',
    'Vigilance', 'Ward', 'Flash', 'Protection', 'Prowess', 'Shroud', 'Equip',
    'Enchant', 'Cycling', 'Kicker', 'Flashback', 'Landwalk'
];

export const DEFAULT_KEYWORDS = [
    ...new Set([...PRINTED_KEYWORDS, ...Object.keys(KEYWORD_CANON)])
];
