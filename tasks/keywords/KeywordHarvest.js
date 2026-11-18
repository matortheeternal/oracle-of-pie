import { harvestLine } from './harvesters/index.js';
import HarvestedKeyword from './HarvestedKeyword.js';

const LINE_BREAK = /\n+/;

export default class KeywordHarvest {
    constructor(scribe) {
        this.scribe = scribe;
        this.keywords = new Map();
    }

    isKnown(name) {
        const match = name.match(this.scribe.keywordPattern);
        return match?.[0].length === name.length;
    }

    addCard(card) {
        const texts = card.faces.map(face => face.oracle_text ?? '');
        const lines = texts.flatMap(text => text.split(LINE_BREAK));
        for (const line of lines) this.addLine(line.trim(), card.name);
    }

    addLine(line, cardName) {
        const harvested = harvestLine(line);
        if (!harvested || this.isKnown(harvested.name)) return;
        const key = harvested.name.toLowerCase();
        if (!this.keywords.has(key))
            this.keywords.set(key, new HarvestedKeyword(harvested.name));
        this.keywords.get(key).add(harvested.reminder, cardName);
    }

    get definitions() {
        return [...this.keywords.values()].map(keyword => keyword.toJSON());
    }
}
