import CardColors from './CardColors.js';
import Keyword from '../values/Keyword.js';

const KICKER = 'kicker';

function isKicker(node) {
    return node instanceof Keyword && node.name === KICKER;
}

function kickerColors(parsedFace) {
    for (const [node] of parsedFace.text.walk())
        if (isKicker(node)) return node.manaColors;
    return [];
}

function conditionColors(face, condition) {
    if (!condition?.requiresKicker) return [];
    return kickerColors(face.parsed);
}

function baseColors(face, condition) {
    const spent = condition?.spentColors ?? [];
    return spent.length ? new CardColors({ colors: spent }) : face.colors;
}

export default function attributedColors(face, context) {
    const condition = context.condition;
    const abilityColors = context.ability?.manaColors ?? [];
    const extra = [...abilityColors, ...conditionColors(face, condition)];
    return baseColors(face, condition).withAbilityColors(extra);
}
