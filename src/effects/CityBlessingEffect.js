import Effect from './Effect.js';

const BLESSING = /^gets? the city's blessing\b/i;

export default class CityBlessingEffect extends Effect {
    static get pattern() {
        return BLESSING;
    }
}
