import Node from '../core/Node.js';

const QUOTED = /^"([^"]*)"/;

function isTemporary(context) {
    return Boolean(context.effectDuration?.isTemporary || context.condition?.isDuration);
}

function recipientController(recipient, controller) {
    if (recipient?.controlledByOpponent) return 'opponent';
    if (recipient?.controlledByYou || recipient?.refersToSelf) return controller;
    return null;
}

export default class QuotedAbility extends Node {
    static match(scribe, str) {
        return str.match(QUOTED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = scribe.parseText(match[1]);
    }

    get children() {
        return [this.text];
    }

    childContext(context) {
        const temporaryGrant = isTemporary(context) || null;
        const { parentEffect: source, abilityController: controller = 'you' } = context;
        const abilityRecipient = source?.quotedAbilityController
            ? source.quotedAbilityRecipient
            : source?.actingSubject?.resolved;
        const abilityController = source?.quotedAbilityController
            ? source.quotedAbilityController(context, controller)
            : recipientController(abilityRecipient, controller);
        return {
            ...context, granted: true, temporaryGrant, abilityRecipient,
            abilityController
        };
    }
}
