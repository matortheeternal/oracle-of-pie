const OPPONENT_LOSES_LIFE = { kind: 'LoseLifeEffect', subjectIsOpponent: true };
const OPPONENT_DAMAGED = { kind: 'DamageEffect', phrases: { hitsPlayer: true } };
const OPPONENT_HARM = { any: [OPPONENT_LOSES_LIFE, OPPONENT_DAMAGED] };
const SOURCE_TEXT = { granted: false, expansion: null };
const LIFE_LOST_THIS_TURN = new RegExp(
    String.raw`\b(?:lost (?:\d+ or more )?life`
    + String.raw`|life (?:you(?:'ve)?|they|that player|your opponents(?: have)?) lost)`
    + String.raw` this turn\b`,
    'i'
);
const LIFE_LOSS_EVENT = {
    kind: 'LosesLifeEvent',
    unreadSubject: null,
    unreadText: null
};

export const LIFE_TAGS = [
    {
        tag: 'drain-life',
        match: {
            kind: 'GainLifeEffect',
            subjectIsYou: true,
            any: [
                { context: { sentence: { effects: OPPONENT_HARM } } },
                {
                    actingSubject: { isYou: true },
                    context: {
                        ...SOURCE_TEXT,
                        sentence: { previous: { effects: OPPONENT_HARM } }
                    }
                }
            ]
        }
    },
    {
        tag: 'life-loss-matters',
        match: {
            context: SOURCE_TEXT,
            any: [
                {
                    kind: 'Keyword',
                    name: ['spectacle', 'start your engines!'],
                    context: { ability: { kind: 'KeywordAbility' } }
                },
                { kind: 'Sentence', raw: LIFE_LOST_THIS_TURN },
                {
                    ...LIFE_LOSS_EVENT,
                    any: [
                        { subjectPhrase: { player: ['a player', 'an opponent'] } },
                        { isYou: true, turnWindow: { kind: 'TurnWindow' } }
                    ]
                }
            ]
        }
    },
    {
        tag: 'life-payment',
        match: {
            any: [
                {
                    kind: 'ActivatedAbility', cost: { paysLife: true },
                    context: { granted: false }
                },
                { kind: 'PayLifeEffect', subjectIsYou: true, repeatsPriorPayment: false },
                { kind: 'LoseLifeEffect', subjectIsYou: true }
            ]
        }
    }
];
