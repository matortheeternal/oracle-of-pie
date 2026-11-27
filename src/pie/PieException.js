import Query from '../evaluators/Query.js';
import Citation from './Citation.js';
import { PRIMARY } from './ColorTier.js';

export default class PieException {
    constructor({ id, title, colors, cites, match }) {
        this.id = id;
        this.title = title;
        this.colors = colors;
        this.citation = Citation.of(cites);
        this.query = Query.compile(match);
    }

    matches(node, context) {
        return this.query.test(node, context);
    }

    tiersOver(baseTiers) {
        const allowed = Object.fromEntries(this.colors.map(color => [color, PRIMARY]));
        return baseTiers.withOverrides(allowed, `exception ${this.id}`);
    }
}
