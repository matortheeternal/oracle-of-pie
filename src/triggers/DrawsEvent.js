import ActionEvent from './ActionEvent.js';
import DrawStepException from './qualifiers/DrawStepException.js';
import OrdinalCard from './objects/OrdinalCard.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const DRAWS = /^(?<subject>.+?) draws?\b/i;

export default class DrawsEvent extends ActionEvent {
    static get pattern() {
        return DRAWS;
    }

    static get objectParsers() {
        return [OrdinalCard, ...PHRASE_PARSERS];
    }

    static get qualifierParsers() {
        return [TurnWindow, DrawStepException];
    }

    get ordinalCard() {
        return this.objectPhrase instanceof OrdinalCard ? this.objectPhrase : null;
    }

    get ordinal() {
        return this.ordinalCard?.ordinal ?? null;
    }
}
