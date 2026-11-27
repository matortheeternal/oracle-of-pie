import tagInspection from './tagInspection.js';
import { EXTRA_ATTACK, UNTAPPED_CREATURES, SACRIFICIAL_MANA } from './exceptions.js';

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
        exceptions: [SACRIFICIAL_MANA]
    }),
    tagInspection({
        id: 'extra-untap',
        title: 'Untaps your permanents en masse',
        group: 'Mana & lands',
        exceptions: [EXTRA_ATTACK, UNTAPPED_CREATURES]
    }),
    {
        id: 'freeze-creature',
        title: 'Keeps creatures tapped',
        group: 'Control',
        match: { tag: 'freeze-creature', not: YOUR_OWN_PERMANENTS }
    },
    {
        id: 'drain-life',
        title: 'Drains life',
        group: 'Life',
        match: { kind: 'GainLifeEffect', subjectIsYou: true, context: LIFE_LOSS_SENTENCE }
    },
    tagInspection({
        id: 'cost-increaser',
        title: 'Taxes spells',
        group: 'Costs'
    })
];
