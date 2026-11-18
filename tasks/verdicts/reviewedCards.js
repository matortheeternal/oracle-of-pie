import { cardKey } from '../corpusScribe.js';
import loadProjects from '../custom/loadProjects.js';

export default function reviewedCards(corpus, projectsFile) {
    const cards = new Map(corpus.map(card => [cardKey(card), card]));
    for (const card of loadProjects(projectsFile)) cards.set(card.id, card);
    return cards;
}
