import PieCondition from './PieCondition.js';

const OPPONENT_DRAWS = { kind: 'DrawEffect', subject: { canBeOpponent: true } };

export const WHEEL = new PieCondition({
    id: 'wheel',
    title: 'Discarding paired with drawing',
    match: { context: { cardText: { effects: { any: [OPPONENT_DRAWS] } } } },
    groups: ['Card flow']
});
