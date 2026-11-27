import PieCondition from './PieCondition.js';

const REMOVAL = ['Removal'];
const CONTROLLER_FINDS_RANDOM_CARD = {
    findsRandomCard: true,
    subject: { canBeOpponent: true }
};
const RANDOMLY_REPLACED = { effects: { any: [CONTROLLER_FINDS_RANDOM_CARD] } };
const CONTROLLER_GETS_TOKEN = {
    kind: 'CreateTokenEffect',
    subject: { canBeOpponent: true }
};

export const RANDOM_REPLACEMENT = new PieCondition({
    id: 'polymorph',
    title: 'Replaced by a random card for its controller',
    match: { context: { cardText: RANDOMLY_REPLACED } },
    groups: REMOVAL
});

export const TOKEN_REPLACEMENT = new PieCondition({
    id: 'token-exchange',
    title: 'Replaced by a token for its controller',
    match: { context: { cardText: { effects: { any: [CONTROLLER_GETS_TOKEN] } } } },
    groups: REMOVAL
});
