export const TYPE_WORDS = {
    creature: 'creature', creatures: 'creature',
    artifact: 'artifact', artifacts: 'artifact',
    enchantment: 'enchantment', enchantments: 'enchantment',
    land: 'land', lands: 'land',
    planeswalker: 'planeswalker', planeswalkers: 'planeswalker',
    battle: 'battle', battles: 'battle',
    kindred: 'kindred', scheme: 'scheme', schemes: 'scheme',
    permanent: 'permanent', permanents: 'permanent',
    spell: 'spell', spells: 'spell',
    card: 'card', cards: 'card',
    token: 'token', tokens: 'token',
    conspiracy: 'conspiracy', conspiracies: 'conspiracy',
    instant: 'instant', instants: 'instant',
    sorcery: 'sorcery', sorceries: 'sorcery',
    ability: 'ability', abilities: 'ability',
    player: 'player', players: 'player',
    opponent: 'opponent', opponents: 'opponent',
    source: 'source', sources: 'source'
};

export const SEA_MONSTER_TYPES = new Set([
    'Kraken', 'Leviathan', 'Octopus', 'Serpent', 'Whale'
]);

export const QUALIFIER_WORDS = new Set([
    'white', 'blue', 'black', 'red', 'green', 'colorless', 'monocolored',
    'multicolored', 'tapped', 'untapped', 'attacking', 'blocking', 'blocked',
    'unblocked', 'other', 'legendary', 'basic', 'snow', 'enchanted',
    'equipped', 'face-down', 'face-up', 'activated', 'triggered', 'loyalty',
    'chosen', 'exiled', 'prepared', 'goaded', 'suspected', 'saddled',
    'monstrous', 'double-faced', 'transformed', 'historic',
    'token', 'commander', 'commanders', 'kicked', 'outlaws', 'suspended', 'modal',
    'renowned', 'warped'
]);

export const NEGATED_QUALIFIER = /^non-?[a-z]+$/i;
export const SUBTYPE_WORD = /^\p{Lu}\p{Ll}+(?:-\p{Lu}?\p{Ll}+)?$/u;
