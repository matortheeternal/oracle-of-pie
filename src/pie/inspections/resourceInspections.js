import ColorTiers from '../ColorTiers.js';
import { PRIMARY, SECONDARY, TERTIARY, NONE } from '../ColorTier.js';

const CREATURE_CARD = { isCreatureCard: true };
const FORCED_OPPONENT = { isOptional: false, subject: { isOpponent: true } };

export const RESOURCE_INSPECTIONS = [
    {
        id: 'discard-opponent',
        title: 'Makes opponents discard',
        group: 'Card flow',
        tiers: ColorTiers.of(NONE, TERTIARY, PRIMARY, TERTIARY, NONE),
        description: 'Black owns targeted discard. Red discards randomly; blue rarely.',
        match: { kind: 'DiscardEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'mill-opponent',
        title: 'Mills opponents',
        group: 'Graveyard',
        tiers: ColorTiers.of(NONE, PRIMARY, SECONDARY, NONE, NONE),
        description: 'Blue owns milling opponents; black is secondary.',
        match: { kind: 'MillEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'tutor-nonland',
        title: 'Searches the library for a nonland card',
        group: 'Card flow',
        tiers: ColorTiers.of(SECONDARY, SECONDARY, PRIMARY, TERTIARY, SECONDARY),
        description: 'Black tutors anything. Other colors tutor their own card types.',
        match: { kind: 'SearchLibraryEffect', toHand: true, findsLand: false }
    },
    {
        id: 'land-ramp',
        title: 'Puts lands from the library onto the battlefield',
        group: 'Mana & lands',
        tiers: ColorTiers.of(TERTIARY, NONE, NONE, TERTIARY, PRIMARY),
        description: 'Green owns land ramp. White ramps to catch up.',
        match: {
            kind: 'SearchLibraryEffect',
            card: { isLand: false },
            findsLand: true,
            toBattlefield: true
        }
    },
    {
        id: 'reanimate',
        title: 'Returns creature cards from graveyard to battlefield',
        group: 'Graveyard',
        tiers: ColorTiers.of(SECONDARY, TERTIARY, PRIMARY, NONE, TERTIARY),
        description: 'Black reanimates anything; white returns small creatures.',
        match: {
            any: [
                {
                    kind: 'ReturnEffect',
                    destination: 'battlefield',
                    fromGraveyard: true,
                    phrases: CREATURE_CARD
                },
                {
                    kind: 'PutEffect',
                    toBattlefield: true,
                    phrases: { ...CREATURE_CARD, zone: 'graveyard' }
                }
            ]
        }
    },
    {
        id: 'regrowth',
        title: 'Returns creature cards from graveyard to hand',
        group: 'Graveyard',
        tiers: ColorTiers.of(TERTIARY, NONE, PRIMARY, NONE, PRIMARY),
        description: 'Black and green return creature cards to hand.',
        match: {
            kind: 'ReturnEffect',
            destination: 'hand',
            fromGraveyard: true,
            phrases: CREATURE_CARD
        }
    }
];
