import tagInspection from './tagInspection.js';

export const CARD_FLOW_INSPECTIONS = [
    tagInspection({
        id: 'draw-cards',
        title: 'Draws cards',
        group: 'Card flow',
        tag: 'draw'
    }),
    tagInspection({
        id: 'loot',
        title: 'Draws, then discards',
        group: 'Card flow'
    }),
    tagInspection({
        id: 'rummage',
        title: 'Discards, then draws',
        group: 'Card flow'
    }),
    tagInspection({
        id: 'discard-outlet',
        title: 'Discards your own cards',
        group: 'Costs'
    }),
    tagInspection({
        id: 'mill-self',
        title: 'Mills yourself',
        group: 'Graveyard'
    })
];
