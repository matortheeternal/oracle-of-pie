import Parser from './core/Parser.js';
import Effect from './effects/Effect.js';

const REMINDER = /\s*\([^()]*\)/g;
const LINE_BREAK = /\n+/;
const PARENTHESES = /^\(|\)$/g;
const MULTILINE_REMINDER = /\([^()]*\n[^()]*\)/g;
const INNER_LINE_BREAK = /\s*\n\s*/g;
const LEADING_SENTENCE = /^([^.]+)\. (?=[A-Z])/;

function stripParentheses(reminder) {
    return reminder.trim().replace(PARENTHESES, '');
}

export default class CardText extends Parser {
    static fromText(scribe, text) {
        return CardText.parse(scribe, [''], text);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.abilities = [];
        this.reminders = [];
        const text = str.replace(MULTILINE_REMINDER, reminder =>
            reminder.replace(INNER_LINE_BREAK, ' '));
        for (const line of text.split(LINE_BREAK)) this.parseLine(line);
        this.remainingStr = '';
    }

    parseLine(line) {
        const reminders = line.match(REMINDER) ?? [];
        this.reminders.push(...reminders.map(reminder => reminder.trim()));
        const text = line.replace(REMINDER, '').trim();
        if (!text) return;
        const abilities = this.parseAbilities(text);
        abilities[0]?.reminders?.push(...reminders.map(stripParentheses));
        for (const ability of abilities) ability?.apply(this.abilities);
    }

    parseAbilities(text) {
        const ability = this.parseNext(text, this.scribe.abilityParsers);
        if (ability?.isRecognized) return [ability];
        return this.splitLeadingKeyword(text) ?? [ability];
    }

    isEffectSentence(text) {
        const ability = this.parseNext(text, this.scribe.abilityParsers);
        return Boolean(ability?.isRecognized && !ability.isKeywordOnly);
    }

    isWholeKeyword(ability) {
        if (!ability?.isKeywordOnly) return false;
        return ability.isRecognized && !ability.hasParameterText;
    }

    splitLeadingKeyword(text) {
        const leading = text.match(LEADING_SENTENCE);
        if (!leading) return null;
        const sentence = leading[1];
        if (this.isEffectSentence(`${sentence}.`)) return null;
        const keyword = this.parseNext(sentence, this.scribe.abilityParsers);
        if (!this.isWholeKeyword(keyword)) return null;
        const rest = text.slice(leading[0].length);
        return [keyword, this.parseNext(rest, this.scribe.abilityParsers)];
    }

    get children() {
        return this.abilities;
    }

    get hasOnlyKeywordAbilities() {
        return this.abilities.length > 0
            && this.abilities.every(ability => ability.isKeywordOnly);
    }

    get effects() {
        this.cachedEffects ??= [...this.walk()]
            .map(([node]) => node)
            .filter(node => node instanceof Effect);
        return this.cachedEffects;
    }

    get hasAdditionalCost() {
        return this.abilities.some(ability => ability.hasAdditionalCost);
    }

    childContext(context) {
        return { ...context, cardText: context.cardText ?? this };
    }
}
