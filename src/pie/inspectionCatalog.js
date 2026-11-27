import { COLORS } from './ColorProfile.js';
import PieInspector from './PieInspector.js';
import EXAMPLES from './inspectionCatalogExamples.json' with { type: 'json' };

const SCHEMA_VERSION = 2;

function describeException({ id, title, colors }) {
    return { id, title, colors: COLORS.filter(color => colors.includes(color)) };
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

export function getInspectionCatalog() {
    const inspections = PieInspector.createInspections({}).map(describeInspection);
    return { schemaVersion: SCHEMA_VERSION, inspections };
}
