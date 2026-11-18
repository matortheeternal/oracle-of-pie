export function isOpposingObject(phrase) {
    if (phrase.refersToSelf || phrase.controlledByYou) return false;
    if (phrase.isCardInZone) return false;
    return !phrase.isPlayer;
}

export function isRemovalTarget(phrase, type) {
    return isOpposingObject(phrase) && phrase.hasType(type);
}

export function hitsCreature(phrase) {
    return !phrase.refersToSelf && !phrase.controlledByYou && phrase.hasType('creature');
}

export function hitsPlayer(phrase) {
    if (phrase.isPlayer) return phrase.canBeOpponent;
    if (phrase.isAnyTarget) return true;
    return Boolean(phrase.hasExactType?.('player') || phrase.hasExactType?.('opponent'));
}

export function requiresFlying(phrase) {
    return Boolean(phrase.requiredKeywords?.includes('flying'));
}
