import { COLORS } from './ColorProfile.js';
import PieInspector from './PieInspector.js';
import EXAMPLES from './inspectionCatalogExamples.json' with { type: 'json' };

const SCHEMA_VERSION = 1;

function describeException({ id, title, overrides }) {
    const colors = COLORS.filter(color => Object.hasOwn(overrides, color));
    const tiers = Object.fromEntries(colors.map(color => [color, overrides[color].name]));
    return { id, title, tiers };
}

function describeInspection(inspection) {
    const { id, title, group, subgroup, description, tiers, exceptions } = inspection;
    return {
        id, title, group, subgroup, description,
        tiers: tiers.toJSON(),
        exceptions: exceptions.map(describeException),
        examples: structuredClone(EXAMPLES[id] ?? [])
    };
}

export default function inspectionCatalog() {
    const inspections = PieInspector.createInspections({}).map(describeInspection);
    return { schemaVersion: SCHEMA_VERSION, inspections };
}
