import SelfOrAnother from './SelfOrAnother.js';
import AttachedReference from '../../phrases/AttachedReference.js';

const OR_ATTACHED = /^ or (?=(?:enchanted|equipped) )/i;

export default class SelfOrAttached extends SelfOrAnother {
    static get connector() {
        return OR_ATTACHED;
    }

    static get otherParsers() {
        return [AttachedReference];
    }
}
