import Effect from './Effect.js';

const STATE_ALTERNATIVES = [
    'the monarch', 'day\\b', 'night\\b', 'plotted', 'prepared', 'blocked', 'untapped',
    'tapped', 'saddled', 'attached'
];
const BECOMES = new RegExp(`^becomes? (?!${STATE_ALTERNATIVES.join('|')})`, 'i');
const DESCRIPTION = /^(?:[^,."]|"[^"]*")+?(?= until | for as long as |,|\.|$)/i;
const CREATURE = /\bcreatures?\b/i;
const POWER_TOUGHNESS = /\b\d+\/\d+\b/;

export default class BecomesEffect extends Effect {
    static get pattern() {
        return BECOMES;
    }

    parseArguments(match) {
        this.description = this.consumeText(DESCRIPTION)?.[0] ?? null;
    }

    get isComplete() {
        return Boolean(this.description);
    }

    get becomesCreature() {
        return CREATURE.test(this.description ?? '');
    }

    get setsPowerToughness() {
        return POWER_TOUGHNESS.test(this.description ?? '');
    }
}
