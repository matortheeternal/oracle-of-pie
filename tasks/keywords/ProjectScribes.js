import { createCorpusScribe } from '../corpusScribe.js';
import ProjectKeywords from './ProjectKeywords.js';

export default class ProjectScribes {
    constructor(corpus, cards) {
        this.corpus = corpus;
        this.base = createCorpusScribe(corpus);
        this.keywords = new Map();
        this.scribes = new Map();
        for (const card of cards) this.keywordsFor(card)?.addCard(card);
    }

    keywordsFor(card) {
        if (!card.project) return null;
        if (!this.keywords.has(card.project)) {
            const keywords = new ProjectKeywords(this.base, card.projectDir);
            this.keywords.set(card.project, keywords);
        }
        return this.keywords.get(card.project);
    }

    forCard(card) {
        if (!this.keywords.has(card.project)) return this.base;
        if (!this.scribes.has(card.project))
            this.scribes.set(card.project, this.build(card));
        return this.scribes.get(card.project);
    }

    build(card) {
        const keywords = this.keywords.get(card.project).definitions;
        return createCorpusScribe(this.corpus, { keywords });
    }

    get definitionsByProject() {
        const entries = [...this.keywords].map(([project, keywords]) => [
            project, keywords.definitions
        ]);
        return Object.fromEntries(entries);
    }
}
