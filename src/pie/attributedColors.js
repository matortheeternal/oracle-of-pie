import CardColors from './CardColors.js';
import Keyword from '../values/Keyword.js';
import Ability from '../abilities/Ability.js';

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
    return condition.namedKickerColors ?? kickerColors(face.parsed);
}

function baseColors(face, condition) {
    const spent = condition?.spentColors ?? [];
    return spent.length ? new CardColors({ colors: spent }) : face.colors;
}

function abilityChain(context, node) {
    const abilities = context.abilities ?? [];
    return node instanceof Ability ? [...abilities, node] : abilities;
}

export default function attributedColors(face, context, node = null) {
    const condition = context.condition;
    const abilities = abilityChain(context, node);
    const abilityColors = abilities.flatMap(ability => ability.manaColors ?? []);
    const extra = [...abilityColors, ...conditionColors(face, condition)];
    return baseColors(face, condition).withAbilityColors(extra);
}
