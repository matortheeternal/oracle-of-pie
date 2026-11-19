import TagPolicy from './TagPolicy.js';

export default class ExtraTagPolicy extends TagPolicy {
    get kind() {
        return 'extra';
    }

    expectsPrediction() {
        return true;
    }

    matchesCard(tag, faces) {
        return faces.some(face => this.matchesFace(tag, face));
    }

    matchesFace(tag, face) {
        const match = face.tagMatches.get(tag);
        return Boolean(match) && this.query.test(match.node, match.context);
    }
}
