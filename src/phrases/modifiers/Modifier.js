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

    get keywords() {
        return [];
    }

    get restrictsTargeting() {
        return false;
    }

    get restrictsName() {
        return false;
    }

    get relatesToObject() {
        return false;
    }
}
