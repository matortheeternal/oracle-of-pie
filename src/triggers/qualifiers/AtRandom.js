import Node from '../../core/Node.js';

const AT_RANDOM = /^at random\b/i;

export default class AtRandom extends Node {
    static match(scribe, str) {
        return str.match(AT_RANDOM);
    }
}
