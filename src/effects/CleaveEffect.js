import Effect from './Effect.js';

const REMOVE = /^remove the words in square brackets\b/i;

export default class CleaveEffect extends Effect {
    static get pattern() {
        return REMOVE;
    }
}
