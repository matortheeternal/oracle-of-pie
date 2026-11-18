import { HAND_RESETS } from './handReset.js';

function wheel(players) {
    const orders = HAND_RESETS.map(reset => [
        { ...reset, ...players },
        { kind: 'DrawEffect' }
    ]);
    return { any: orders.map(effectOrder => ({ kind: 'Sentence', effectOrder })) };
}

export const WHEEL_TAGS = [
    { tag: 'wheel-one-sided', match: wheel({ subjectIsYou: true }) },
    { tag: 'wheel-symmetrical', match: wheel({ subjectIsYou: false, affectsYou: true }) }
];
