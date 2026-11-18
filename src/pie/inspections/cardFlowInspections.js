import tagInspection from './tagInspection.js';

export const CARD_FLOW_INSPECTIONS = [
    tagInspection('draw-cards', 'Draws cards', 'draw'),
    tagInspection('loot', 'Draws, then discards'),
    tagInspection('rummage', 'Discards, then draws'),
    tagInspection('discard-outlet', 'Discards your own cards'),
    tagInspection('mill-self', 'Mills yourself')
];
