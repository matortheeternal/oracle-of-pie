import { getInspectionCatalog } from '../../src/pie/inspectionCatalog.js';

const shortNames = {
    counterspell: 'spell countering',
    'counter-ability': 'ability countering',
    'destroy-creature': 'creature destruction',
    'exile-creature': 'creature exile',
    'bounce-creature': 'creature bounce',
    edict: 'forced sacrifice',
    'shrink-creature': 'toughness reduction',
    'destroy-artifact': 'artifact removal',
    'destroy-enchantment': 'enchantment removal',
    'damage-creature': 'direct creature damage',
    'damage-player': 'direct player damage',
    bite: 'bite',
    fight: 'fight',
    'discard-opponent': 'forced discard',
    'mill-opponent': 'opponent mill',
    'tutor-nonland': 'nonland tutoring',
    'land-ramp': 'land ramp',
    reanimate: 'reanimation',
    regrowth: 'creature recovery',
    'tap-creature': 'creature tapping',
    'steal-permanently': 'permanent control theft',
    threaten: 'temporary control theft',
    flicker: 'flicker',
    'gain-life': 'life gain',
    'draw-cards': 'card draw',
    loot: 'looting',
    rummage: 'rummaging',
    'discard-outlet': 'a discard outlet',
    'mill-self': 'self-mill',
    unblockable: 'unblockability',
    firebreathing: 'firebreathing',
    'shade-pump': 'self-pumping',
    'extra-combat-phase': 'an extra combat phase',
    'mana-dork': 'a mana creature',
    'extra-untap': 'mass untapping',
    'freeze-creature': 'freezing creatures',
    'drain-life': 'life drain',
    'cost-increaser': 'spell taxation'
};

const descriptions = {
    reanimate: 'Returns creature cards from a graveyard to the battlefield.'
};

const catalog = new Map(getInspectionCatalog().inspections.map(entry => [
    entry.id, entry
]));

function sentence(text) {
    return text.endsWith('.') ? text : text + '.';
}

export default function inspectionWording({ inspection, title }) {
    const name = shortNames[inspection] ?? title.toLowerCase();
    const catalogDescription = catalog.get(inspection)?.description;
    const definition = descriptions[inspection] ?? (catalogDescription || title);
    return { name, definition: sentence(definition) };
}
