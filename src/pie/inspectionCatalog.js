import { COLORS } from './ColorProfile.js';
import PieInspector from './PieInspector.js';
import { PIE_CONDITIONS } from './conditions/index.js';

const SCHEMA_VERSION = 3;

function describeException({ condition, arguments: args, title, colors }) {
    const ordered = COLORS.filter(color => colors.includes(color));
    return { condition: condition.id, ...args, title, colors: ordered };
}

function conditionsFor(inspection) {
    return PIE_CONDITIONS
        .filter(condition => condition.appliesTo(inspection))
        .map(condition => condition.id);
}

function describeInspection(inspection) {
    const { id, title, group, subgroup, description, tiers, exceptions } = inspection;
    return {
        id, title, group, subgroup, description,
        tiers: tiers.toJSON(),
        conditions: conditionsFor(inspection),
        exceptions: exceptions.map(describeException),
        scryfall: inspection.scryfall,
        example: structuredClone(inspection.example)
    };
}

export function getInspectionCatalog() {
    const inspections = PieInspector.createInspections({}).map(describeInspection);
    const conditions = PIE_CONDITIONS.map(condition => condition.toJSON());
    return { schemaVersion: SCHEMA_VERSION, conditions, inspections };
}
