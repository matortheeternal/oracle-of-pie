const DISCARD_HAND = { kind: 'DiscardEffect', discardsHand: true };
const SHUFFLE_HAND = { kind: 'ShuffleIntoLibraryEffect', shufflesHand: true };

export const HAND_RESETS = [DISCARD_HAND, SHUFFLE_HAND];

export const WHEEL_SENTENCE = { sentence: { effects: { any: HAND_RESETS } } };
