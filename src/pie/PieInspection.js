import Query from '../evaluators/Query.js';

export default class PieInspection {
    constructor({ id, title, group, tiers, description = '', match }) {
        this.id = id;
        this.title = title;
        this.group = group;
        this.tiers = tiers;
        this.description = description;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
