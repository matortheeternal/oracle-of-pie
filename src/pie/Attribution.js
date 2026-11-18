import evidenceOf from '../evaluators/evidenceOf.js';
import attributedColors from './attributedColors.js';

export default class Attribution {
    constructor(inspection, face, { node, context }) {
        this.inspection = inspection;
        this.colors = attributedColors(face, context);
        this.evidence = evidenceOf(node, context);
    }
}
