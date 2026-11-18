import Parser from './core/Parser.js';
import Effect from './effects/Effect.js';

const REMINDER = /\s*\([^()]*\)/g;
const LINE_BREAK = /\n+/;
const PARENTHESES = /^\(|\)$/g;

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
        for (const line of str.split(LINE_BREAK)) this.parseLine(line);
        this.remainingStr = '';
    }

    parseLine(line) {
        const reminders = line.match(REMINDER) ?? [];
        this.reminders.push(...reminders.map(reminder => reminder.trim()));
        const text = line.replace(REMINDER, '').trim();
        if (!text) return;
        const ability = this.parseNext(text, this.scribe.abilityParsers);
        ability?.reminders?.push(...reminders.map(stripParentheses));
        ability?.apply(this.abilities);
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
