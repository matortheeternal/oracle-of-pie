import tagInspection from './tagInspection.js';
import { allow } from '../conditions/index.js';
import { WITH_UNBLOCKABLE } from '../conditions/combatConditions.js';

export const COMBAT_INSPECTIONS = [
    tagInspection({
        id: 'unblockable',
        title: 'Can’t be blocked',
        group: 'Creatures & combat',
        cites: 'Can\'t be blocked'
    }),
    tagInspection({
        id: 'firebreathing',
        title: 'Pumps its own power',
        group: 'Creatures & combat',
        exceptions: [allow(WITH_UNBLOCKABLE, ['U'])],
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
