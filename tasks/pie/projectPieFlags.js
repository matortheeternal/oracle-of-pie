import { parseCardFaces } from '../corpus/pieCorpus.js';
import {
    PieInspector, DEFAULT_PIE_INSPECTIONS, keywordInspections
} from '../../src/index.js';

function cardForInspection(card) {
    return {
        ...card.view,
        colors: card.faces.flatMap(face => face.colors),
        mana_cost: card.faces.map(face => face.mana_cost).join(' // ')
    };
}

export default class ProjectPieFlags {
    constructor(scribes, profiles) {
        this.scribes = scribes;
        this.profiles = profiles;
        this.inspectors = new Map();
    }

    inspectorFor(card) {
        if (!this.inspectors.has(card.project))
            this.inspectors.set(card.project, this.buildInspector(card));
        return this.inspectors.get(card.project);
    }

    buildInspector(card) {
        const tiers = this.scribes.keywordsFor(card)?.pieTiers ?? {};
        const inspections = [...DEFAULT_PIE_INSPECTIONS, ...keywordInspections(tiers)];
        return new PieInspector({ profiles: this.profiles, inspections });
    }

    flagsFor(card) {
        const faces = parseCardFaces(this.scribes.forCard(card), cardForInspection(card));
        return this.inspectorFor(card).inspect(faces).map(flag => flag.toJSON());
    }
}
