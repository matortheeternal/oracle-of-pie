import Query from './Query.js';

export default class Evaluator {
    constructor({ tag, description = '', match }) {
        this.tag = tag;
        this.description = description;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
