import evidenceOf from '../evaluators/evidenceOf.js';
import attributedColors from './attributedColors.js';

export default class Attribution {
    constructor(inspection, face, { node, context }, faceIndex = 0) {
        this.inspection = inspection;
        this.face = face;
        this.faceIndex = faceIndex;
        this.exceptions = inspection.exceptionsFor(node, context);
        this.colors = attributedColors(face, context, node);
        this.evidence = evidenceOf(node, context);
    }

    get range() {
        return this.face.parsed.locate?.(this.evidence) ?? null;
    }

    get exception() {
        return this.exceptions[0] ?? null;
    }

    get citation() {
        return this.exception?.citation ?? this.inspection.citation;
    }

    get tiers() {
        const allow = (tiers, exception) => exception.tiersOver(tiers);
        return this.exceptions.reduce(allow, this.inspection.tiers);
    }
}
