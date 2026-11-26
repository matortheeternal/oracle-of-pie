import ReminderLineHarvester from './ReminderLineHarvester.js';
import ReferenceEntryHarvester from './ReferenceEntryHarvester.js';

export const KEYWORD_HARVESTERS = [ReminderLineHarvester, ReferenceEntryHarvester];

export function harvestLine(line) {
    for (const harvester of KEYWORD_HARVESTERS) {
        const match = harvester.match(line);
        if (match) return new harvester(match);
    }
    return null;
}
