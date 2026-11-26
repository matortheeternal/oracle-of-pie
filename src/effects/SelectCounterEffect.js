import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { normalizeCounterKind } from './counterKinds.js';

const CHOOSE_COUNTER = /^chooses? (?:a|one) (?:kind of )?counter on /i;
const GIVE_COUNTER = /^gives? /i;
const SAME_KIND = /^another counter of that kind\b/i;
const KIND_PER_REMOVAL = new RegExp(
    '^an? (?<kind>[a-z]+) counter for each '
        + '(?<removed>[+−-]\\d+/[+−-]\\d+|[a-z]+) counter removed this way\\b',
    'i'
);
const COUNTER_NAMES = '(?:[+−-]\\d+/[+−-]\\d+|[a-z]+(?: [a-z]+)?)';
const COUNTER_CHOICES = `${COUNTER_NAMES}(?:, ${COUNTER_NAMES})*,? and ${COUNTER_NAMES}`;
const RANDOM_MISSING_KIND = new RegExp(
    '^chooses? a kind of counter at random that this creature doesn\'t have on it '
        + `from among (?<choices>${COUNTER_CHOICES})(?![\\w-])`,
    'i'
);
const CHOICE_SEPARATOR = /,? and |, /i;

export class ChooseCounterEffect extends Effect {
    static get pattern() {
        return CHOOSE_COUNTER;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(RANDOM_MISSING_KIND);
    }

    parseArguments(match) {
        const kinds = match.groups?.choices.toLowerCase().split(CHOICE_SEPARATOR);
        this.counterKinds = kinds?.map(normalizeCounterKind) ?? [];
        this.choosesMissingKindAtRandom = Boolean(kinds);
        if (this.choosesMissingKindAtRandom) return;
        this.sources = this.consume([PhraseList]);
    }

    get parts() {
        return [this.sources].filter(Boolean);
    }

    get isComplete() {
        return this.choosesMissingKindAtRandom || Boolean(this.sources);
    }
}

export class GiveMatchingCounterEffect extends Effect {
    static get pattern() {
        return GIVE_COUNTER;
    }

    parseArguments() {
        this.recipients = this.consume([PhraseList]);
        this.matchesExistingKind = Boolean(this.consumeText(SAME_KIND));
        const perRemoval = this.consumeText(KIND_PER_REMOVAL)?.groups;
        this.grantedKind = perRemoval?.kind ?? null;
        this.scalesWithRemovalOfKind = perRemoval?.removed ?? null;
    }

    get parts() {
        return [this.recipients].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.recipients && (this.matchesExistingKind || this.grantedKind));
    }
}
