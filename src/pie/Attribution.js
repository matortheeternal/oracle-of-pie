import evidenceOf from '../evaluators/evidenceOf.js';
import attributedColors from './attributedColors.js';

export default class Attribution {
    constructor(inspection, face, { node, context }, faceIndex = 0) {
        this.inspection = inspection;
        this.face = face;
        this.faceIndex = faceIndex;
        this.exception = inspection.exceptionFor(node, context);
        this.colors = attributedColors(face, context);
        this.evidence = evidenceOf(node, context);
    }

    get range() {
        return this.face.parsed.locate?.(this.evidence) ?? null;
    }

    get citation() {
        return this.exception?.citation ?? this.inspection.citation;
    }

    get tiers() {
        const base = this.inspection.tiers;
        return this.exception ? this.exception.tiersOver(base) : base;
    }
}
