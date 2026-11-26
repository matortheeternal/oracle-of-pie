import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import ZoneModifier from '../phrases/modifiers/ZoneModifier.js';

const ZONES = '(?:hand(?: and graveyard)?|graveyard(?: and hand)?)';
const SHUFFLE = new RegExp(
    `^shuffles? (?:their|your) (${ZONES}) into (?:their|your) library`, 'i'
);
const HAND = /\bhand\b/i;
const SHUFFLE_OBJECT = /^shuffles? (?=[^,.]+ into (?:their|your) librar)/i;
const LIBRARY = /^into (?<owner>their|your) librar(?:y|ies)\b/i;

export default class ShuffleIntoLibraryEffect extends Effect {
    static get pattern() {
        return SHUFFLE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(SHUFFLE_OBJECT);
    }

    parseArguments(match) {
        this.zones = match[1] ?? null;
        if (this.zones) return;
        this.objects = this.consume([PhraseList]);
        this.libraryOwner = this.consumeText(LIBRARY)?.groups.owner ?? null;
        this.source = this.libraryOwner ? this.consume([ZoneModifier]) : null;
    }

    get parts() {
        return [this.objects, this.source].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.zones || (this.objects && this.libraryOwner));
    }

    get shufflesHand() {
        return HAND.test(this.zones);
    }
}
