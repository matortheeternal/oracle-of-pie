import tagInspection from './tagInspection.js';
import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

export const COMBAT_INSPECTIONS = [
    tagInspection({
        id: 'gives-haste',
        title: 'Gives haste',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(TERTIARY, NONE, SECONDARY, PRIMARY, TERTIARY),
        description: 'Red owns haste; black is secondary.'
    }),
    tagInspection({
        id: 'gives-deathtouch',
        title: 'Gives deathtouch',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(NONE, NONE, PRIMARY, TERTIARY, PRIMARY),
        description: 'Black and green own deathtouch.'
    }),
    tagInspection({
        id: 'gives-first-strike',
        title: 'Gives first strike',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(PRIMARY, NONE, TERTIARY, PRIMARY, NONE),
        description: 'White and red own first strike.'
    }),
    tagInspection({
        id: 'gives-trample',
        title: 'Gives trample',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(NONE, NONE, TERTIARY, SECONDARY, PRIMARY),
        description: 'Green owns trample; red is secondary.'
    }),
    tagInspection({
        id: 'unblockable',
        title: 'Can’t be blocked',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(NONE, PRIMARY, SECONDARY, TERTIARY, NONE),
        description: 'Blue owns unblockability; black is secondary.'
    }),
    tagInspection({
        id: 'firebreathing',
        title: 'Pumps its own power',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(NONE, NONE, TERTIARY, PRIMARY, TERTIARY),
        description: 'Red owns firebreathing.'
    }),
    tagInspection({
        id: 'shade-pump',
        title: 'Pumps itself +N/+N',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(TERTIARY, NONE, PRIMARY, TERTIARY, SECONDARY),
        description: 'Black owns shade pumps; green is secondary.'
    }),
    tagInspection({
        id: 'extra-combat-phase',
        title: 'Adds combat phases',
        group: 'Creatures & combat',
        tiers: ColorTiers.of(TERTIARY, NONE, NONE, PRIMARY, TERTIARY),
        description: 'Red owns extra combats.'
    })
];
