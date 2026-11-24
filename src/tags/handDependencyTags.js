const SOURCE_TEXT = { granted: false, expansion: null };
const COUNT_HAND = new RegExp(
    String.raw`\b(?:number of|for each) cards? in `
    + String.raw`(?:your|their|that player's|an opponent's|`
    + String.raw`(?:each|target) (?:player|opponent)'s) hand\b`,
    'i'
);
const HAND_SIZE = new RegExp(
    String.raw`\b(?:has|have|with) (?:exactly )?`
    + String.raw`(?:no|zero|one|two|three|four|five|six|seven|eight|nine|`
    + String.raw`ten|thirteen|\d+)`
    + String.raw`(?: or (?:more|fewer|less|seven))? cards? in `
    + String.raw`(?:your |their |its |his or her )?hand\b`,
    'i'
);
const COMPARE_HANDS = new RegExp(
    String.raw`\b(?:has|have) (?:at least (?:\w+ )?)?(?:more|fewer) cards in hand than\b`,
    'i'
);
const EMPTY_HAND = new RegExp(
    String.raw`\b(?:has|have|with) (?:no|exactly zero or seven) cards in `
    + String.raw`(?:your |their )?hand\b`, 'i'
);
const DISCARDED_CARD_PAYOFF = new RegExp(
    String.raw`\b(?:for each card (?:you (?:have )?discarded|you've discarded)`
    + String.raw`|if you discarded (?:a|one or more) (?:nonland|land|creature) cards?)\b`,
    'i'
);
const EMPTY_HAND_LOSS = { effects: { kind: 'GameResultEffect', winsGame: false } };

function sentence(raw) {
    return { kind: 'Sentence', raw, card: { isInsert: false }, context: SOURCE_TEXT };
}

function handCheck(raw) {
    return { ...sentence(raw), not: EMPTY_HAND_LOSS };
}

export const HAND_DEPENDENCY_TAGS = [
    {
        tag: 'hand-size-matters',
        match: {
            any: [sentence(COUNT_HAND), handCheck(HAND_SIZE), handCheck(COMPARE_HANDS)]
        }
    },
    {
        tag: 'hellbent',
        match: {
            any: [
                handCheck(EMPTY_HAND),
                {
                    kind: 'AbilityWordAbility',
                    abilityWord: 'Hellbent',
                    context: SOURCE_TEXT
                }
            ]
        }
    },
    {
        tag: 'hellbending',
        match: {
            kind: 'ActivatedAbility',
            isRepeatable: true,
            limitsUses: false,
            context: SOURCE_TEXT,
            cost: {
                isOnlyDiscard: true,
                items: { kind: 'TextCost', text: 'discard a card' }
            },
            body: {
                sentences: {
                    effects: {
                        kind: ['GrantEffect', 'ModifyPTEffect'],
                        subject: { refersToSelf: true }
                    }
                }
            }
        }
    },
    {
        tag: 'self-discard-matters',
        match: {
            context: SOURCE_TEXT,
            any: [
                {
                    kind: 'Keyword',
                    name: ['madness', 'mayhem'],
                    context: { ability: { kind: 'KeywordAbility' } }
                },
                {
                    kind: 'DiscardsEvent',
                    isYou: true,
                    consumesSelf: false,
                    isReflexive: false
                },
                sentence(DISCARDED_CARD_PAYOFF)
            ]
        }
    }
];
