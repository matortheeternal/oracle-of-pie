import ActionEvent from './ActionEvent.js';
import PhraseList from '../phrases/PhraseList.js';

const ALTERNATIVES = new Set(['or', 'and/or']);

export default class ConsumingEvent extends ActionEvent {
    parseObjectPhrase() {
        const objects = this.consume([PhraseList]);
        const [first, ...others] = objects?.phrases ?? [];
        this.additionalObjects = others;
        this.objectConnectors = objects?.connectors ?? [];
        return first ?? null;
    }

    get objectParticipants() {
        return [...super.objectParticipants, ...this.additionalObjects];
    }

    get consumesSelf() {
        const alternatives = this.objectConnectors.some(connector =>
            ALTERNATIVES.has(connector.toLowerCase()));
        const includesSource = this.objectParticipants.some(
            phrase => phrase?.refersToSelf
        );
        return includesSource && !alternatives;
    }

    get isRepeatable() {
        return !this.consumesSelf;
    }
}
