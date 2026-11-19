import Effect from './Effect.js';

const ONE_FORM = 'to [^,.]+? in the form of [^,.]+? counters';
const DAMAGE_FORM = new RegExp(`^deals? damage (${ONE_FORM}(?: and ${ONE_FORM})?)`, 'i');
const FORM = /to (?<recipients>.+?) in the form of (?<counter>.+?) counters/gi;

export default class DamageFormEffect extends Effect {
    static get pattern() {
        return DAMAGE_FORM;
    }

    parseArguments(match) {
        this.forms = [...match[1].matchAll(FORM)].map(form => ({ ...form.groups }));
    }

    get counterKinds() {
        return this.forms.map(form => form.counter);
    }
}
