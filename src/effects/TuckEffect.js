import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const OWNER_OF = /^the owner of (?=target )/i;
const TARGET_OWNER = /^(target [^,.]+?)'s owner (?=puts?|shuffles?)/i;
const TUCK_START = new RegExp(
    '^(?:the owner of target |target [^,.]+?\'s owner'
        + ' (?:puts?|shuffles?) it )', 'i'
);
const PUTS_IT = /^(?:puts?|shuffles?) it /i;
const LIBRARY_POSITIONS = [
    'on their choice of the top or bottom of their library',
    'on (?:the )?(?:top|bottom) of their library',
    'into their library(?: [^,.]+)?'
];
const LIBRARY_POSITION = new RegExp(`^(?:${LIBRARY_POSITIONS.join('|')})`, 'i');

export default class TuckEffect extends Effect {
    static get pattern() {
        return TUCK_START;
    }

    parseArguments(match) {
        this.remainingStr = match.input;
        this.objects = this.consumeTarget();
        this.consumeText(PUTS_IT);
        this.position = this.consumeText(LIBRARY_POSITION)?.[0] ?? null;
    }

    consumeTarget() {
        const owned = this.consumeText(TARGET_OWNER);
        if (owned) return this.parseNext(owned[1], [PhraseList]);
        this.consumeText(OWNER_OF);
        return this.consume([PhraseList]);
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects && this.position);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get removesPermanently() {
        return true;
    }
}
