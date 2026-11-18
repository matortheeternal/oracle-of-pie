import tagInspection from './tagInspection.js';
import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

export const SUPPORT_INSPECTIONS = [
    tagInspection({
        id: 'mana-dork',
        title: 'Creatures that tap for mana',
        group: 'Mana & lands',
        tiers: ColorTiers.of(TERTIARY, TERTIARY, TERTIARY, TERTIARY, PRIMARY),
        description: 'Green owns mana creatures.'
    }),
    tagInspection({
        id: 'extra-untap',
        title: 'Untaps your permanents en masse',
        group: 'Mana & lands',
        tiers: ColorTiers.of(TERTIARY, SECONDARY, NONE, SECONDARY, PRIMARY),
        description: 'Green owns mass untapping; blue and red are secondary.'
    }),
    tagInspection({
        id: 'freeze-creature',
        title: 'Keeps creatures tapped',
        group: 'Control',
        tiers: ColorTiers.of(SECONDARY, PRIMARY, NONE, TERTIARY, NONE),
        description: 'Blue owns freezing; white is secondary.'
    }),
    tagInspection({
        id: 'drain-life',
        title: 'Drains life',
        group: 'Life',
        tiers: ColorTiers.of(SECONDARY, NONE, PRIMARY, TERTIARY, TERTIARY),
        description: 'Black owns drain; white is secondary.'
    }),
    tagInspection({
        id: 'gives-hexproof',
        title: 'Gives hexproof',
        group: 'Protection',
        tiers: ColorTiers.of(SECONDARY, SECONDARY, NONE, NONE, PRIMARY),
        description: 'Green owns hexproof; white and blue are secondary.'
    }),
    tagInspection({
        id: 'gives-indestructible',
        title: 'Gives indestructible',
        group: 'Protection',
        tiers: ColorTiers.of(PRIMARY, NONE, TERTIARY, TERTIARY, SECONDARY),
        description: 'White owns indestructible; green is secondary.'
    }),
    tagInspection({
        id: 'cost-increaser',
        title: 'Taxes spells',
        group: 'Costs',
        tiers: ColorTiers.of(PRIMARY, SECONDARY, TERTIARY, TERTIARY, NONE),
        description: 'White owns taxing; blue is secondary.'
    })
];
