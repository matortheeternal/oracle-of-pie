import { cardKey } from '../corpus/corpusScribe.js';
import loadProjects from '../custom/loadProjects.js';

export default function reviewedCards(corpus) {
    const cards = new Map(corpus.map(card => [cardKey(card), card]));
    for (const card of loadProjects()) {
        if (!card.isPlayable) continue;
        cards.set(card.id, card);
    }
    return cards;
}
