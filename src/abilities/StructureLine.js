import Ability from './Ability.js';

const STRUCTURE_ALTERNATIVES = [
    'LEVEL \\d+(?:-\\d+|\\+)',
    'STATION \\d+\\+',
    '\\d+\\/\\d+',
    '[+\\-−]?\\d+\\/[+\\-−]?\\d+'
];
const STRUCTURE = new RegExp(
    `^(${STRUCTURE_ALTERNATIVES.join('|')})$`, 'i'
);

export default class StructureLine extends Ability {
    static match(scribe, str) {
        return str.match(STRUCTURE);
    }
}
