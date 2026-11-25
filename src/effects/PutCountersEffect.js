import Effect from './Effect.js';
import { isPlusOneKind, lowersToughness } from './counterKinds.js';
import CounterQuantity from '../values/CounterQuantity.js';
import PhraseList from '../phrases/PhraseList.js';

const PUT = /^puts? /i;
const ON = /^(?:equal to [^,.]+? )?on (?:each of )?/i;
const JOINER = /^(?:,? ?(?:and|or) |, )/i;
const EQUAL_TO = /^equal to [^,.]+/i;
const STUN = 'stun';

export default class PutCountersEffect extends Effect {
    static get pattern() {
        return PUT;
    }

    static get recipientPattern() {
        return ON;
    }

    static match(scribe, str) {
        const lead = str.match(this.pattern);
        if (!lead) return null;
        const first = CounterQuantity.match(scribe, str.slice(lead[0].length));
        if (!first) return null;
        return lead;
    }

    parseArguments() {
        this.quantities = [this.consume([CounterQuantity])];
        this.connectors = [];
        while (this.consumeNextQuantity()) continue;
        const recipient = this.consumeText(this.constructor.recipientPattern);
        this.objects = recipient ? this.consume([PhraseList]) : null;
        this.amount = this.quantities[0].amount;
        this.kind = this.quantities[0].kinds[0] ?? null;
        this.consumeText(EQUAL_TO);
        this.additionalPlacement = this.consumeAdditionalPlacement();
    }

    consumeAdditionalPlacement() {
        if (!this.objects) return null;
        const joiner = this.remainingStr.match(JOINER);
        if (!joiner) return null;
        const text = this.remainingStr.slice(joiner[0].length);
        if (!CounterQuantity.match(this.scribe, text)) return null;
        const placement = this.parseNext('put ' + text, [PutCountersEffect]);
        if (!placement?.isRecognized) return null;
        this.remainingStr = placement.remainingStr;
        return placement;
    }

    consumeNextQuantity() {
        const start = this.remainingStr;
        const connector = this.consumeText(JOINER);
        if (!connector) return false;
        const quantity = this.consume([CounterQuantity]);
        if (!quantity) {
            this.remainingStr = start;
            return false;
        }
        this.quantities.push(quantity);
        this.connectors.push(connector[0].trim());
        return true;
    }

    get kinds() {
        return this.quantities.flatMap(quantity => quantity.kinds);
    }

    get isStunCounter() {
        return this.kinds.includes(STUN);
    }

    get movesCounters() {
        return this.quantities.some(quantity => quantity.movesExistingCounters);
    }

    get keywordCounterNames() {
        return this.kinds.filter(kind => this.scribe.isKeyword(kind));
    }

    get conferredKeywordNames() {
        return this.keywordCounterNames;
    }

    get parts() {
        return [...this.quantities, this.objects, this.additionalPlacement]
            .filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.objects);
    }

    get phrases() {
        return this.objects?.phrases ?? [];
    }

    get isPlusCounters() {
        return this.kinds.some(isPlusOneKind);
    }

    get isMinusCounters() {
        return this.kinds.some(lowersToughness);
    }
}
