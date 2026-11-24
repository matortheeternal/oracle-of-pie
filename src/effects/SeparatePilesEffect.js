import Effect from './Effect.js';

const PILES = '(?<piles>two piles|a face-down pile and a face-up pile)';
const SEPARATE = new RegExp(`^separates? (?<objects>[^,.]+?) into ${PILES}`, 'i');
const FACE_DOWN = /face-down/i;

export default class SeparatePilesEffect extends Effect {
    static get pattern() {
        return SEPARATE;
    }

    parseArguments(match) {
        this.objects = match.groups.objects;
        this.piles = match.groups.piles.toLowerCase();
    }

    get hasFaceDownPile() {
        return FACE_DOWN.test(this.piles);
    }
}
