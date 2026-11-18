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
    'unblocked', 'other', 'legendary', 'basic', 'nonbasic', 'snow', 'enchanted',
    'equipped', 'historic', 'modified', 'face-down', 'activated', 'triggered',
    'outlaw', 'chosen', 'exiled', 'nontoken', 'token'
]);

export const NEGATED_QUALIFIER = /^non-?[a-z]+$/i;
export const SUBTYPE_WORD = /^[A-Z][a-z]+(?:-[a-z]+)?$/;

export const NONCREATURE_SUBTYPES = new Set([
    'Food', 'Treasure', 'Clue', 'Blood', 'Map', 'Powerstone', 'Gold', 'Incubator',
    'Junk', 'Equipment', 'Vehicle', 'Fortification', 'Contraption', 'Attraction',
    'Aura', 'Saga', 'Shrine', 'Class', 'Room', 'Case', 'Curse', 'Role', 'Background',
    'Cartouche', 'Rune', 'Siege', 'Plains', 'Island', 'Swamp', 'Mountain', 'Forest',
    'Desert', 'Gate', 'Cave', 'Sphere', 'Town', 'Lair', 'Locus', 'Mine', 'Tower',
    'Planet', 'Spacecraft'
]);
