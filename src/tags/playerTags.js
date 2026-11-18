export const PLAYER_TAGS = [
    {
        tag: 'energy-generator',
        match: { kind: 'PlayerCountersEffect', givesEnergy: true, subjectIsYou: true }
    },
    {
        tag: 'alternate-win-condition',
        match: { kind: 'GameResultEffect', winsGame: true, subjectIsYou: true }
    },
    {
        tag: 'hand-size-increase',
        match: { kind: 'HandSizeEffect', subjectIsYou: true }
    },
    {
        tag: 'coin-flip',
        match: { kind: 'CoinFlipEffect' }
    },
    {
        tag: 'play-additional-land',
        match: { kind: 'ExtraLandEffect' }
    }
];
