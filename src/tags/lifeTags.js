const OPPONENT_LOSES_LIFE = { kind: 'LoseLifeEffect', subjectIsOpponent: true };
const OPPONENT_DAMAGED = { kind: 'DamageEffect', phrases: { hitsPlayer: true } };
const DRAIN_SENTENCE = {
    sentence: { effects: { any: [OPPONENT_LOSES_LIFE, OPPONENT_DAMAGED] } }
};

export const LIFE_TAGS = [
    {
        tag: 'drain-life',
        match: { kind: 'GainLifeEffect', subjectIsYou: true, context: DRAIN_SENTENCE }
    },
    {
        tag: 'life-payment',
        match: { kind: 'ActivatedAbility', cost: { paysLife: true } }
    }
];
