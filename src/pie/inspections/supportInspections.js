import tagInspection from './tagInspection.js';

const OPPONENT_LOSES_LIFE = { kind: 'LoseLifeEffect', subjectIsOpponent: true };
const LIFE_LOSS_SENTENCE = { sentence: { effects: { any: [OPPONENT_LOSES_LIFE] } } };

export const SUPPORT_INSPECTIONS = [
    tagInspection({
        id: 'mana-dork',
        title: 'Creatures that tap for mana',
        group: 'Mana & lands'
    }),
    tagInspection({
        id: 'extra-untap',
        title: 'Untaps your permanents en masse',
        group: 'Mana & lands'
    }),
    tagInspection({
        id: 'freeze-creature',
        title: 'Keeps creatures tapped',
        group: 'Control'
    }),
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
