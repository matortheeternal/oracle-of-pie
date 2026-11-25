import Effect from './Effect.js';

import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const SIZE = '(' + NUMBER_PATTERN + ')';
const DIE = '(?<dieCount>' + NUMBER_PATTERN + ') (?:d(?<d>[0-9]+)|(?<sides>'
    + SIZE + ')-sided (?:die|dice))';
const DICE = '(?<count>' + NUMBER_PATTERN + '|that many) (?<planar>planar )?dice';
const ROLL_DIE = new RegExp('^rolls? (?:' + DIE + '|' + DICE + ')\\b', 'i');
const EXTRA_DICE = new RegExp('^plus (' + NUMBER_PATTERN + ')\\b', 'i');
const IGNORE = /^and ignore (?:the lowest|the highest) rolls?\b/i;
const ROLL_MODIFIER = /^\s*and add ([^.]+)/i;

export default class RollDieEffect extends Effect {
    static get pattern() {
        return ROLL_DIE;
    }

    parseArguments(match) {
        const { d, sides, count, dieCount, planar } = match.groups;
        this.sides = numberValue(d ?? sides ?? '') || null;
        this.countText = count ?? dieCount ?? null;
        this.isPlanar = Boolean(planar);
        this.readModifiers();
    }

    readModifiers() {
        this.additionalDice = numberValue(this.consumeText(EXTRA_DICE)?.[1] ?? '0');
        this.ignoredRoll = this.consumeText(IGNORE)?.[0] ?? null;
        this.modifier = this.consumeText(ROLL_MODIFIER)?.[1] ?? null;
    }
}
