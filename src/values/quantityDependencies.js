const MANA_VALUE = /\b(?:mana value|converted mana cost)\b/i;
const CREATURE_COUNT = new RegExp(
    String.raw`\b(?:for each creature|number of creatures) `
    + '(?:you control|on the battlefield)(?:$| plus )',
    'i'
);
const OPPOSING_ARTIFACT_COUNT = new RegExp(
    '\\b(?:for each artifact|number of artifacts) '
        + '(?:(?:an opponent|defending player) controls|your opponents control)$',
    'i'
);
const EQUAL_TO = /^(?:(?:damage|life|cards) )?equal to /i;

export function scalesAmountWithManaValue(amount) {
    const text = amount ?? '';
    return EQUAL_TO.test(text) && usesManaValue(text);
}

export function usesManaValue(amount) {
    return MANA_VALUE.test(amount);
}

export function usesCreatureCount(amount) {
    return CREATURE_COUNT.test(amount ?? '');
}

export function usesOpposingArtifactCount(amount) {
    return OPPOSING_ARTIFACT_COUNT.test(amount ?? '');
}
