import { allow } from '../conditions/index.js';
import { WHEEL } from '../conditions/cardFlowConditions.js';

const CREATURE_CARD = { isCreatureCard: true };
const FORCED_OPPONENT = { isOptional: false, subject: { canBeOpponent: true } };
const DRAWS_IN_SENTENCE = { sentence: { effects: { any: [{ kind: 'DrawEffect' }] } } };
const REPLACED_BY_DRAW = { context: DRAWS_IN_SENTENCE };

export const RESOURCE_INSPECTIONS = [
    {
        id: 'discard-opponent',
        title: 'Makes opponents discard',
        cards: 'cards that make opponents discard',
        group: 'Card flow',
        scryfall: 'otag:discard',
        example: { typeLine: 'Sorcery', text: 'Target opponent discards two cards.' },
        exceptions: [allow(WHEEL, ['R'], '"Wheeling"')],
        match: { kind: 'DiscardEffect', ...FORCED_OPPONENT, not: REPLACED_BY_DRAW }
    },
    {
        id: 'mill-opponent',
        title: 'Mills opponents',
        cards: 'cards that mill opponents',
        group: 'Graveyard',
        scryfall: 'otag:mill-opponent',
        example: { typeLine: 'Sorcery', text: 'Target opponent mills five cards.' },
        match: { kind: 'MillEffect', ...FORCED_OPPONENT }
    },
    {
        id: 'tutor-nonland',
        title: 'Searches the library for a nonland card',
        cards: 'cards that search for nonland cards',
        group: 'Card flow',
        scryfall: 'otag:tutor-to-hand',
        example: {
            typeLine: 'Sorcery',
            text: 'Search your library for a card, put that card '
                + 'into your hand, then shuffle.'
        },
        match: { kind: 'SearchLibraryEffect', toHand: true, findsLand: false }
    },
    {
        id: 'land-ramp',
        title: 'Puts lands from the library onto the battlefield',
        cards: 'cards that put lands from the library onto the battlefield',
        group: 'Mana & lands',
        scryfall: 'otag:tutor-land-to-battlefield',
        example: {
            typeLine: 'Sorcery',
            text: 'Search your library for a basic land card, put it onto '
                + 'the battlefield tapped, then shuffle.'
        },
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
        cards: 'cards that return creatures from the graveyard to the battlefield',
        group: 'Graveyard',
        scryfall: 'otag:reanimate-creature',
        example: {
            typeLine: 'Sorcery',
            text: 'Return target creature card from your graveyard to the battlefield.'
        },
        cites: '"Reanimation"',
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
        cards: 'cards that return creature cards from the graveyard to hand',
        group: 'Graveyard',
        scryfall: 'otag:regrowth-creature',
        example: {
            typeLine: 'Sorcery',
            text: 'Return target creature card from your graveyard to your hand.'
        },
        cites: 'Return target creature from graveyard to hand.',
        match: {
            kind: 'ReturnEffect',
            destination: 'hand',
            fromGraveyard: true,
            phrases: CREATURE_CARD
        }
    }
];
