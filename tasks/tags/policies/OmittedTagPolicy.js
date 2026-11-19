import TagPolicy from './TagPolicy.js';
import { Query } from '../../../src/index.js';

export default class OmittedTagPolicy extends TagPolicy {
    constructor({ unless = null, ...spec }) {
        super(spec);
        this.unlessQuery = unless && Query.compile(unless);
    }

    get kind() {
        return 'omitted';
    }

    expectsPrediction() {
        return false;
    }

    matchesCard(tag, faces) {
        const walked = faces.flatMap(face => face.walked);
        const matches = ([node, context]) => this.query.test(node, context);
        if (!walked.some(matches)) return false;
        return !this.unlessQuery || !walked.some(this.matchesUnless, this);
    }

    matchesUnless([node, context]) {
        return this.unlessQuery.test(node, context);
    }
}
