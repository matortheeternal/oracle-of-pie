import ColorTiers from './ColorTiers.js';
import {
    MECHANICAL_COLOR_PIE, MECHANICAL_COLOR_PIE_SOURCE
} from './mechanicalColorPie.js';

export default class Citation {
    static of(line) {
        const tiers = MECHANICAL_COLOR_PIE[line];
        return tiers ? new Citation(line, tiers) : null;
    }

    constructor(line, tierNames) {
        this.line = line;
        this.tierNames = tierNames;
    }

    get label() {
        return `MCP ${this.line}`;
    }

    get tiers() {
        return ColorTiers.fromNames(this.tierNames, this.label);
    }

    toJSON() {
        const { title, url } = MECHANICAL_COLOR_PIE_SOURCE;
        return { source: title, url, line: this.line, tiers: this.tierNames };
    }
}
