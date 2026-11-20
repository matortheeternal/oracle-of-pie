import Effect from './Effect.js';

const REDIRECT_DAMAGE = new RegExp(
    '^all damage that would be dealt(?<thisTurn> this turn)?'
        + ' to (?<originalRecipient>[^,.]+?)'
        + ' is dealt to (?<newRecipient>[^,.]+?) instead(?=$|[,.;])',
    'i'
);

export default class RedirectDamageEffect extends Effect {
    static get pattern() {
        return REDIRECT_DAMAGE;
    }

    parseArguments(match) {
        this.originalRecipient = match.groups.originalRecipient;
        this.newRecipient = match.groups.newRecipient;
        this.isThisTurn = Boolean(match.groups.thisTurn);
    }
}
