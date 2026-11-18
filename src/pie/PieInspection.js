import Query from '../evaluators/Query.js';

export default class PieInspection {
    constructor({ id, title, description = '', match }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
