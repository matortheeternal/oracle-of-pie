const VILLAINOUS_CHOICE = /\bfaces? a villainous choice — /i;
const PLAYER_COUNT = /^where X is (?:one plus )?the number of (?:players|opponents)\b/i;
const DRAW_PLAYER_COUNT = /^draws? cards equal to the number of (?:players|opponents)\b/i;
const TOKEN_PLAYER_COUNT = new RegExp(
    '^a number of [^"]+\\btokens equal to the number of (?:players|opponents)\\b', 'i'
);
const SOURCE_TEXT = { granted: false, expansion: null };
const ALL_PLAYERS = /^players$/i;
const OPPOSED_CHOICE = {
    kind: [
        'VillainousChoiceSentence',
        'EffectSentence',
        'ConditionalSentence',
        'TriggerSentence'
    ],
    context: SOURCE_TEXT,
    raw: VILLAINOUS_CHOICE
};

export const PLAYER_TAGS = [
    { tag: 'opponent-chooses', match: OPPOSED_CHOICE },
    { tag: 'punisher', match: OPPOSED_CHOICE },
    {
        tag: 'per-player',
        match: {
            context: SOURCE_TEXT,
            any: [
                { kind: 'TrailingCondition', text: PLAYER_COUNT },
                { kind: 'DrawEffect', raw: DRAW_PLAYER_COUNT },
                { kind: 'CreateTokenEffect', description: TOKEN_PLAYER_COUNT }
            ]
        }
    },
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
        match: {
            kind: 'HandSizeEffect',
            increasesMaximum: true,
            any: [{ affectsYou: true }, { actingSubject: { raw: ALL_PLAYERS } }]
        }
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
