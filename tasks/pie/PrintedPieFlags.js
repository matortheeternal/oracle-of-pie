import { PieInspector } from 'oracle-of-pie';
import { createCorpusScribe } from '../corpusScribe.js';
import { parseCardFaces } from '../pieCorpus.js';

export default class PrintedPieFlags {
    constructor(corpus, profiles) {
        this.scribe = createCorpusScribe(corpus);
        this.inspector = new PieInspector({ profiles });
    }

    flagsFor(card) {
        const faces = parseCardFaces(this.scribe, card);
        return this.inspector.inspect(faces).map(flag => flag.toJSON());
    }
}
