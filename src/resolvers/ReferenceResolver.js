import Resolver from './Resolver.js';
import ReferenceScope from './ReferenceScope.js';

export default class ReferenceResolver extends Resolver {
    static resolve(cardText) {
        ReferenceScope.resolveAbilities(cardText);
    }
}
