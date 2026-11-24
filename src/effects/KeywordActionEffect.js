import Effect from './Effect.js';
import Expansion from '../definitions/Expansion.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const REPEAT = '(?: twice| again| (?:\\w+ )?times)?';
export const ACTION_AMOUNT = `(?: (?<amount>${NUMBER_PATTERN})\\b)?${REPEAT}`;

const TRANSFORM_SELF = /^transform (?:~|this\b|it\b)/i;
const SCRY_ADJUSTMENT = new RegExp(`^that many cards plus ${NUMBER_PATTERN}\\b`, 'i');

export default class KeywordActionEffect extends Effect {
    static match(scribe, str) {
        return str.match(scribe.actionPattern);
    }

    get expansions() {
        this.cachedExpansions ??= this.definition.hasReminder
            ? [Expansion.of(this.scribe, this.definition, this)]
            : [];
        return this.cachedExpansions;
    }

    parseArguments(match) {
        this.actionText = match[1];
        this.amountText = match.groups.amount ?? null;
        this.definition = this.scribe.definitions.actions.definitionFor(this.actionText);
        this.action = this.definition.key;
        if (this.action === 'scry' && this.amountText === null)
            this.amountText = this.consumeText(SCRY_ADJUSTMENT)?.[0] ?? null;
    }

    get isKeywordAction() {
        return true;
    }

    get findsRandomCard() {
        return this.definition.findsRandomCard;
    }

    get consumesSource() {
        return TRANSFORM_SELF.test(this.actionText);
    }
}
