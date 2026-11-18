import tagInspection from './tagInspection.js';

export const SUPPORT_INSPECTIONS = [
    tagInspection({
        id: 'mana-dork',
        title: 'Creatures that tap for mana',
        group: 'Mana & lands'
    }),
    tagInspection({
        id: 'extra-untap',
        title: 'Untaps your permanents en masse',
        group: 'Mana & lands'
    }),
    tagInspection({
        id: 'freeze-creature',
        title: 'Keeps creatures tapped',
        group: 'Control'
    }),
    tagInspection({
        id: 'drain-life',
        title: 'Drains life',
        group: 'Life'
    }),
    tagInspection({
        id: 'cost-increaser',
        title: 'Taxes spells',
        group: 'Costs'
    })
];
