import Query from '../evaluators/Query.js';
import PieException from './PieException.js';

export default class PieInspection {
    constructor({ id, title, group, tiers, description = '', exceptions = [], match }) {
        this.id = id;
        this.title = title;
        this.group = group;
        this.tiers = tiers;
        this.description = description;
        this.exceptions = exceptions.map(exception => new PieException(exception));
        this.query = Query.compile(match);
    }

    exceptionFor(node, context) {
        const applies = exception => exception.matches(node, context);
        return this.exceptions.find(applies) ?? null;
    }

    matches(node, context) {
        return this.query.test(node, context);
    }
}
