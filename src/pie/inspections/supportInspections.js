import tagInspection from './tagInspection.js';
import { allow } from '../conditions/index.js';
import { EXTRA_ATTACK, UNTAPPED_CREATURES } from '../conditions/combatConditions.js';
import { SACRIFICE_COST } from '../conditions/costConditions.js';

const OPPONENT_LOSES_LIFE = { kind: 'LoseLifeEffect', subjectIsOpponent: true };
const YOUR_OWN_PERMANENTS = {
    any: [{ phrases: { controlledByYou: true } }, { subject: { controlledByYou: true } }]
};
const LIFE_LOSS_SENTENCE = { sentence: { effects: { any: [OPPONENT_LOSES_LIFE] } } };

export const SUPPORT_INSPECTIONS = [
    tagInspection({
        id: 'mana-dork',
        title: 'Creatures that produce mana',
        description: 'Creatures with a repeatable mana ability that costs no mana, '
            + 'including abilities that create Treasure, Gold or Powerstone tokens.',
        group: 'Mana & lands',
        example: { typeLine: 'Creature', text: '{T}: Add one mana of any color.' },
        exceptions: [allow(SACRIFICE_COST, ['B'], 'Mana production, temporary')]
    }),
    tagInspection({
        id: 'extra-untap',
        title: 'Untaps your permanents en masse',
        group: 'Mana & lands',
        example: { typeLine: 'Instant', text: 'Untap all creatures you control.' },
        exceptions: [
            allow(EXTRA_ATTACK, ['R'], 'Extra attack'),
            allow(UNTAPPED_CREATURES, ['W', 'U', 'G'], 'Untapping creatures')
        ]
    }),
    {
        id: 'freeze-creature',
        title: 'Keeps creatures tapped',
        group: 'Control',
        scryfall: 'otag:freeze-creature',
        example: {
            typeLine: 'Instant',
            text: 'Tap target creature. It doesn\'t untap during its '
                + 'controller\'s next untap step.'
        },
        match: { tag: 'freeze-creature', not: YOUR_OWN_PERMANENTS }
    },
    {
        id: 'drain-life',
        title: 'Drains life',
        group: 'Life',
        scryfall: 'otag:drain-life',
        example: {
            typeLine: 'Sorcery',
            text: 'Target opponent loses 3 life and you gain 3 life.'
        },
        match: { kind: 'GainLifeEffect', subjectIsYou: true, context: LIFE_LOSS_SENTENCE }
    },
    tagInspection({
        id: 'cost-increaser',
        title: 'Taxes spells',
        group: 'Costs',
        example: {
            typeLine: 'Creature',
            text: 'Noncreature spells your opponents cast cost {1} more to cast.'
        }
    })
];
