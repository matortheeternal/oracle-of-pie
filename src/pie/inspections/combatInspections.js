import tagInspection from './tagInspection.js';

export const COMBAT_INSPECTIONS = [
    tagInspection('gives-haste', 'Gives haste'),
    tagInspection('gives-deathtouch', 'Gives deathtouch'),
    tagInspection('gives-first-strike', 'Gives first strike'),
    tagInspection('gives-trample', 'Gives trample'),
    tagInspection('unblockable', 'Can’t be blocked'),
    tagInspection('firebreathing', 'Pumps its own power'),
    tagInspection('shade-pump', 'Pumps itself +N/+N'),
    tagInspection('extra-combat-phase', 'Adds combat phases')
];
