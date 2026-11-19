import { COLORS, ColorProfile, canonTiers } from '../../src/index.js';

function tierLine(tiers) {
    return COLORS.map(color => `${color}: '${tiers[color]}'`).join(', ');
}

function entry([id, data]) {
    const tiers = canonTiers(new ColorProfile(data));
    return `    '${id}': {\n        ${tierLine(tiers)}\n    }`;
}

export default function canonTierModule(profiles) {
    const entries = Object.entries(profiles).map(entry).join(',\n');
    return `export const CANON_TIERS = {\n${entries}\n};\n`;
}
