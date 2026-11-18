import Query from './Query.js';

export default class Evaluator {
    static matches(spec) {
        return Boolean(spec.tag);
    }

    constructor({ tag, description = '', match }) {
        this.tag = tag;
        this.description = description;
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }

    ownsTag(tag) {
        return tag === this.tag;
    }

    tagsFor(node, context) {
        return this.matches(node, context) ? [this.tag] : [];
    }
}
