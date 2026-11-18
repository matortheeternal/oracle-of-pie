import Query from '../evaluators/Query.js';
import Citation from './Citation.js';

export default class PieException {
    constructor({ id, title, tiers, cites, match }) {
        this.id = id;
        this.title = title;
        this.citation = Citation.of(cites);
        this.overrides = tiers ?? this.citation.tiers.listed;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }

    tiersOver(baseTiers) {
        return baseTiers.withOverrides(this.overrides);
    }
}
