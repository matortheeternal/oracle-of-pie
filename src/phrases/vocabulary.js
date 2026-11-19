export const TYPE_WORDS = {
    creature: 'creature', creatures: 'creature',
    artifact: 'artifact', artifacts: 'artifact',
    enchantment: 'enchantment', enchantments: 'enchantment',
    land: 'land', lands: 'land',
    planeswalker: 'planeswalker', planeswalkers: 'planeswalker',
    battle: 'battle', battles: 'battle',
    permanent: 'permanent', permanents: 'permanent',
    spell: 'spell', spells: 'spell',
    card: 'card', cards: 'card',
    token: 'token', tokens: 'token',
    instant: 'instant', instants: 'instant',
    sorcery: 'sorcery', sorceries: 'sorcery',
    ability: 'ability', abilities: 'ability',
    player: 'player', players: 'player',
    opponent: 'opponent', opponents: 'opponent'
};

export const QUALIFIER_WORDS = new Set([
    'white', 'blue', 'black', 'red', 'green', 'colorless', 'monocolored',
    'multicolored', 'tapped', 'untapped', 'attacking', 'blocking', 'blocked',
    'unblocked', 'other', 'legendary', 'basic', 'snow', 'enchanted',
    'equipped', 'face-down', 'activated', 'triggered', 'loyalty', 'chosen', 'exiled',
    'token', 'commander'
]);

export const NEGATED_QUALIFIER = /^non-?[a-z]+$/i;
export const SUBTYPE_WORD = /^[A-Z][a-z]+(?:-[a-z]+)?$/;
