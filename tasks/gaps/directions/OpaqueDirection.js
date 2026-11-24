import GapDirection from './GapDirection.js';
import { OPAQUE_ALTERNATIVES } from '../../../src/effects/OpaqueEffect.js';

function alternativeFor(raw) {
    const matches = alternative => new RegExp(alternative, 'i').test(raw);
    return OPAQUE_ALTERNATIVES.find(matches);
}

export default class OpaqueDirection extends GapDirection {
    static matches(gap) {
        return gap.kind === 'opaque';
    }

    get title() {
        return 'Replace an opaque effect with a modeled one';
    }

    get matchedAlternative() {
        const alternative = alternativeFor(this.gap.raw);
        if (!alternative) return 'one of its alternatives';
        return `the alternative /${alternative}/`;
    }

    get steps() {
        return [
            `OpaqueEffect recognized this text with ${this.matchedAlternative}, `
                + 'so tags and pie inspections cannot read it.',
            'Add an effect class in src/effects whose pattern matches this wording '
                + 'and whose parseArguments stores semantic properties. RevealEffect and '
                + 'StateEffect are small examples.',
            `Register it in EFFECT_PARSERS (${this.effectsIndex}) before OpaqueEffect.`,
            'Remove the OpaqueEffect alternative once no remaining card needs it.'
        ];
    }

    get relatedClasses() {
        return ['OpaqueEffect', 'RevealEffect', 'StateEffect'];
    }

    get extraFiles() {
        return [this.effectsIndex];
    }
}
