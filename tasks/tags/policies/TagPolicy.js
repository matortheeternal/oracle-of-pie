import { Query } from '../../../src/index.js';
import { NotImplementedError } from '../../../src/core/customErrors.js';

export default class TagPolicy {
    constructor({ id, title, tags = null, exceptTags = [], match, examples = [] }) {
        this.id = id;
        this.title = title;
        this.tags = tags && new Set(tags);
        this.exceptTags = new Set(exceptTags);
        this.query = Query.compile(match);
        this.examples = examples;
    }

    coversTag(tag) {
        if (this.exceptTags.has(tag)) return false;
        return !this.tags || this.tags.has(tag);
    }

    explains(tag, faces) {
        return this.coversTag(tag) && this.matchesCard(tag, faces);
    }

    matchesCard(tag, faces) {
        throw new NotImplementedError('matchesCard');
    }

    expectsPrediction() {
        throw new NotImplementedError('expectsPrediction');
    }
}
