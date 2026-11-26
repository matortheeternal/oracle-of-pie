import Effect from './Effect.js';

const CHOSEN_NAME_AND_TYPE = new RegExp(
    '^its name and creature type are the last chosen name and creature type\\b', 'i'
);

export default class AssignChosenCharacteristicsEffect extends Effect {
    static get pattern() {
        return CHOSEN_NAME_AND_TYPE;
    }

    get assignsName() {
        return true;
    }

    get assignsCreatureType() {
        return true;
    }
}
