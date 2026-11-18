import tagInspection from './tagInspection.js';
import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

export const CARD_FLOW_INSPECTIONS = [
    tagInspection({
        id: 'draw-cards',
        title: 'Draws cards',
        group: 'Card flow',
        tag: 'draw',
        tiers: ColorTiers.of(SECONDARY, PRIMARY, SECONDARY, SECONDARY, SECONDARY),
        description: 'Blue owns card draw; black pays life for it and green draws off '
            + 'creatures.'
    }),
    tagInspection({
        id: 'loot',
        title: 'Draws, then discards',
        group: 'Card flow',
        tiers: ColorTiers.of(NONE, PRIMARY, TERTIARY, SECONDARY, NONE),
        description: 'Blue owns looting; red loots occasionally.'
    }),
    tagInspection({
        id: 'rummage',
        title: 'Discards, then draws',
        group: 'Card flow',
        tiers: ColorTiers.of(NONE, TERTIARY, TERTIARY, PRIMARY, NONE),
        description: 'Red owns rummaging.'
    }),
    tagInspection({
        id: 'discard-outlet',
        title: 'Discards your own cards',
        group: 'Costs',
        tiers: ColorTiers.of(TERTIARY, SECONDARY, SECONDARY, PRIMARY, TERTIARY),
        description: 'Red and blue discard for value; other colors discard as a cost.'
    }),
    tagInspection({
        id: 'mill-self',
        title: 'Mills yourself',
        group: 'Graveyard',
        tiers: ColorTiers.of(NONE, PRIMARY, PRIMARY, TERTIARY, SECONDARY),
        description: 'Blue and black fill their own graveyards; green does for value.'
    })
];
