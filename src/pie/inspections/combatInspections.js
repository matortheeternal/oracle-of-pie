import tagInspection from './tagInspection.js';

export const COMBAT_INSPECTIONS = [
    tagInspection({
        id: 'unblockable',
        title: 'Can’t be blocked',
        group: 'Creatures & combat'
    }),
    tagInspection({
        id: 'firebreathing',
        title: 'Pumps its own power',
        group: 'Creatures & combat',
        cites: '+N/+0 (on creatures)'
    }),
    tagInspection({
        id: 'shade-pump',
        title: 'Pumps itself +N/+N',
        group: 'Creatures & combat'
    }),
    tagInspection({
        id: 'extra-combat-phase',
        title: 'Adds combat phases',
        group: 'Creatures & combat'
    })
];
