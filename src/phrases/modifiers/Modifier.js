import Node from '../../core/Node.js';

export default class Modifier extends Node {
    get controlledByYou() {
        return false;
    }

    get controlledByOpponent() {
        return false;
    }

    get zone() {
        return null;
    }

    get keyword() {
        return null;
    }

    get relatesToObject() {
        return false;
    }
}
