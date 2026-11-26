import { harvestLine } from './harvesters/index.js';
import HarvestedKeyword from './HarvestedKeyword.js';

const LINE_BREAK = /\n+/;
const GRANT_PREFIX = /\b(?:gains?|has|have) (?<name>[a-z]+(?:[ -][a-z]+)?)/;
const GRANT_WITH_REMINDER = new RegExp(
    GRANT_PREFIX.source + '(?: until end of turn)?\\.? \\((?<reminder>[^()]+)\\)$', 'i'
);

export default class KeywordHarvest {
    constructor(scribe) {
        this.scribe = scribe;
        this.keywords = new Map();
        this.grants = new Map();
    }

    isKnown(name) {
        const match = name.match(this.scribe.keywordPattern);
        return match?.[0].length === name.length;
    }

    addCard(card) {
        const texts = card.faces.map(face => face.oracle_text ?? face.rulesText ?? '');
        const lines = texts.flatMap(text => text.split(LINE_BREAK));
        for (const line of lines) this.addLine(line.trim(), card.name);
    }

    addLine(line, cardName) {
        const harvested = harvestLine(line);
        if (!harvested) return this.addGrant(line, cardName);
        if (this.isKnown(harvested.name)) return;
        const key = harvested.name.toLowerCase();
        if (!this.keywords.has(key))
            this.keywords.set(key, new HarvestedKeyword(harvested.name));
        this.keywords.get(key).add(harvested.reminder, cardName);
    }

    addGrant(line, cardName) {
        const grant = line.match(GRANT_WITH_REMINDER)?.groups;
        if (!grant || this.isKnown(grant.name)) return;
        const key = grant.name.toLowerCase();
        const entries = this.grants.get(key) ?? [];
        entries.push({ reminder: grant.reminder, cardName });
        this.grants.set(key, entries);
    }

    get definitions() {
        return [...this.keywords].map(([key, keyword]) =>
            keyword.toJSON(this.grants.get(key)));
    }
}
