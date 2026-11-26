import ObjectEffect from './ObjectEffect.js';
import KeywordList from '../values/KeywordList.js';

const CHOOSE = new RegExp(
    '^(?<secret>secretly )?chooses? (?!not\\b|new targets?\\b|a'
        + ' new target\\b|the same mode\\b)', 'i'
);
const SOURCE = /^from (?:it|among (?:them|those cards|creatures they control))\b/i;
const MINIMUM_LAND_COUNT = new RegExp(
    '^equal to the number of lands controlled by the player who controls the fewest\\b',
    'i'
);
const BLOCK_ASSIGNMENT = new RegExp(
    '^chooses? which creatures block this turn and how those creatures block\\b', 'i'
);
const REPEAT_PER_KEYWORD = /^,? ?and so on for /i;
const TO = /^to (?=(?:draw|create)\b)/i;

export default class ChooseObjectsEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE;
    }

    static match(scribe, str) {
        return str.match(BLOCK_ASSIGNMENT) ?? super.match(scribe, str);
    }

    parseArguments(match) {
        this.assignsBlockers = BLOCK_ASSIGNMENT.test(match[0]);
        if (this.assignsBlockers) return;
        this.isSecret = Boolean(match.groups.secret);
        this.source = this.consumeText(SOURCE)?.[0] ?? null;
        super.parseArguments();
        this.matchesFewestLands = Boolean(this.consumeText(MINIMUM_LAND_COUNT));
        this.additionalKeywords = this.consumeText(REPEAT_PER_KEYWORD)
            ? this.consume([KeywordList]) : null;
        this.selectedAction = this.readSelectedAction();
    }

    readSelectedAction() {
        const recipient = this.primaryObject;
        if (!recipient?.isPlayer || !this.consumeText(TO)) return null;
        const effect = this.consume(this.scribe.effectParsers);
        if (effect) effect.inheritedSubject = recipient;
        return effect;
    }

    get isComplete() {
        return this.assignsBlockers || super.isComplete;
    }

    get parts() {
        return [...super.parts, this.additionalKeywords, this.selectedAction]
            .filter(Boolean);
    }
}
