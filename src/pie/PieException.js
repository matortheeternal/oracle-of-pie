import Query from '../evaluators/Query.js';

export default class PieException {
    constructor({ id, title, tiers, match }) {
        this.id = id;
        this.title = title;
        this.overrides = tiers;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }

    tiersOver(baseTiers) {
        return baseTiers.withOverrides(this.overrides);
    }
}
