import CostItem from './CostItem.js';
import Parser from '../core/Parser.js';
import PutEffect from '../effects/PutEffect.js';
import PayLifeEffect from '../effects/PayLifeEffect.js';
import TapEffect from '../effects/TapEffect.js';
import UntapEffect from '../effects/UntapEffect.js';
import RollDieEffect from '../effects/RollDieEffect.js';
import UnattachEffect from '../effects/UnattachEffect.js';

const COST_ACTIONS = [
    PutEffect, PayLifeEffect, TapEffect, UntapEffect, RollDieEffect, UnattachEffect
];

export default class ActionCost extends CostItem {
    static get actionParsers() {
        return COST_ACTIONS;
    }

    static match(scribe, str) {
        const action = new Parser(scribe).parseNext(str, this.actionParsers);
        if (!action?.isRecognized) return null;
        return Object.assign([action.raw], { action });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.action = match.action;
    }

    get children() {
        return [this.action];
    }

    get includesTap() {
        return this.action instanceof TapEffect;
    }

    get removesSource() {
        return this.action instanceof PutEffect
            && this.action.primaryObject?.refersToSelf;
    }

    get paysLife() {
        return this.action instanceof PayLifeEffect;
    }
}
