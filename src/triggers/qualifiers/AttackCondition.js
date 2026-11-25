import Node from '../../core/Node.js';

const CONDITIONS = [
    'with exactly two creatures',
    'and another legendary creature',
    'and/or your commander',
    'or a commander you control',
    'crewed by ~ this turn',
    'by an Aura you control',
    'who controls eight or more lands',
    'while there are four or more card types among cards in your graveyard',
    'while you have the most life or are tied for most life',
    'next'
];
const ATTACK_CONDITION = new RegExp('^(?:' + CONDITIONS.join('|') + ')\\b', 'i');

export default class AttackCondition extends Node {
    static match(scribe, str) {
        return str.match(ATTACK_CONDITION);
    }
}
