import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const REMOVE = /^removes? (?=[^,.]+ from combat\b)/i;
const FROM_COMBAT = /^from combat\b/i;

export default class RemoveFromCombatEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }

    parseArguments(match) {
        this.objects = this.consume([PhraseList]);
        this.leavesCombat = Boolean(this.consumeText(FROM_COMBAT));
    }

    get parts() {
        return [this.objects].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects && this.leavesCombat);
    }
}
