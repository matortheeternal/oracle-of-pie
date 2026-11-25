import Effect from './Effect.js';
import Expansion from '../definitions/Expansion.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';
import PhraseList from '../phrases/PhraseList.js';

const REPEATED = '(?:that many|(?:up to )?\\w+) times';
const REPEAT = '(?: (?<repetitions>twice|again|once for each [^,.]+|'
    + REPEATED + '|times))?';
export const ACTION_AMOUNT = `(?: (?<amount>${NUMBER_PATTERN})\\b)?${REPEAT}`;

const TRANSFORM_SELF = /^transform (?:~|this\b|it\b)/i;
const LIBRARY_OWNER = `your|their|that player's|target opponent's`;
const LIBRARY_TOP = new RegExp(
    `^the top (?:\\w+ )?cards? of (?:${LIBRARY_OWNER}) library\\b`, 'i'
);
const SCRY_ADJUSTMENT = new RegExp(`^that many cards plus ${NUMBER_PATTERN}\\b`, 'i');
const TAKES_OBJECT = new Set([
    'assimilate', 'detain', 'plot', 'manifest', 'cloak', 'harness'
]);
const SCALING = new RegExp(
    '^(?:a number of times equal to [^,.]+|additional time|for'
        + ' the same value)\\b', 'i'
);

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
        this.repetitions = match.groups.repetitions ?? null;
        this.definition = this.scribe.definitions.actions.definitionFor(this.actionText);
        this.action = this.definition.key;
        this.objectText = this.consumeText(LIBRARY_TOP)?.[0] ?? null;
        this.objects = TAKES_OBJECT.has(this.action) ? this.consume([PhraseList]) : null;
        this.scaling = this.consumeText(SCALING)?.[0] ?? null;
        this.readScryAmount();
    }

    readScryAmount() {
        if (this.action !== 'scry' || this.amountText !== null) return;
        this.amountText = this.consumeText(SCRY_ADJUSTMENT)?.[0] ?? null;
    }

    get isKeywordAction() {
        return true;
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get findsRandomCard() {
        return this.definition.findsRandomCard;
    }

    get consumesSource() {
        return TRANSFORM_SELF.test(this.actionText);
    }
}
