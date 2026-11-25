import Effect from './Effect.js';
import SelfReference from '../phrases/SelfReference.js';
import Expansion from '../definitions/Expansion.js';
import CreatedToken from '../phrases/CreatedToken.js';
import QuotedAbility from '../values/QuotedAbility.js';
import DealsDamageEvent from '../triggers/DealsDamageEvent.js';

const TOKEN_COPY = /^(?: that's a copy of | cop(?:y|ies) of )/i;
const COPY_IT = /^it$/i;
const CREATE = /^creates? /i;
const SINGLE_TOKEN = /^(?:an?|one) \b[^"]*?\btoken\b/i;
const CREATURE_TOKEN = /\bcreature tokens?\b/i;
const ARTIFACT_TOKEN = /^[^"]*?\bartifact(?: creature)? tokens?\b/i;
const ARTIFACT_TYPE = /\bArtifact\b/;
const LAND_TOKEN = /\bland tokens?\b/i;
const QUOTED_TEXT = /"[^"]*"/g;
const TOKEN_DESCRIPTION_ALTERNATIVES = [
    '(?:, (?:and )?| and )an? [^,."]*?\\btoken\\b',
    ' that\'s? tapped and attacking (?:that player|that opponent)',
    ' with (?:"[^"]*"|[^,."])+(?:, and [^.,]+)?',
    ' named (?:"[^"]*"|[^,."])+',
    ' that\'s a copy of [^,.]+',
    ' attached to [^,.]+',
    ' for each (?:[^,.]|, (?=non))+',
    ' equal to [^,.]+',
    ' tapped and attacking(?: (?:that player|that opponent))?',
    ' that\'s tapped and attacking',
    ',? except (?:[^."]|"[^"]*")+',
    ' that (?:are|is) [^,.]+'
];
const TOKEN_NOUN = '((?:[^."]|"[^"]*")*?\\btokens?\\b)';
const TOKEN_DETAILS = `((?:${TOKEN_DESCRIPTION_ALTERNATIVES.join('|')})*)`;
const TOKEN_DESCRIPTION = new RegExp(`^${TOKEN_NOUN}${TOKEN_DETAILS}`, 'i');

function damagesDefendingPlayer(event) {
    return event instanceof DealsDamageEvent && event.isCombat && event.isSelf
        && event.recipient?.player === 'a player' && !event.unreadText;
}

export default class CreateTokenEffect extends Effect {
    static get pattern() {
        return CREATE;
    }

    parseArguments(match) {
        const description = this.consumeText(TOKEN_DESCRIPTION);
        this.description = description?.[0] ?? null;
        const details = description?.[2] ?? '';
        this.copySource = TOKEN_COPY.test(details)
            ? details.replace(TOKEN_COPY, '').split(',')[0]
            : null;
    }

    get isComplete() {
        return Boolean(this.description);
    }

    get parts() {
        this.cachedQuoted ??= this.parseQuotedAbilities();
        return this.cachedQuoted;
    }

    parseQuotedAbilities() {
        const quotes = (this.description ?? '').match(QUOTED_TEXT) ?? [];
        return quotes.map(quote => this.parseQuoted(quote));
    }

    parseQuoted(quote) {
        const match = QuotedAbility.match(this.scribe, quote);
        return new QuotedAbility(this.scribe, match, quote);
    }

    get createdToken() {
        if (!SINGLE_TOKEN.test(this.description ?? '')) return null;
        this.cachedCreatedToken ??= new CreatedToken(this);
        return this.cachedCreatedToken;
    }

    get quotedAbilityRecipient() {
        return this.createdToken;
    }

    quotedAbilityController(context, controller) {
        const creator = this.actingSubject;
        if (this.subjectIsYou) return controller;
        if (creator?.isOpponent && !creator.includesYou) return 'opponent';
        if (creator?.player !== 'that player') return null;
        const events = context.ability?.events;
        return events?.length && events.every(damagesDefendingPlayer) ? 'opponent' : null;
    }

    get copiesExplicitSource() {
        const source = this.copySource ?? '';
        return SelfReference.match(this.scribe, source)?.[0].length === source.length;
    }

    get copiesIt() {
        return COPY_IT.test(this.copySource ?? '');
    }

    get createsCreature() {
        return CREATURE_TOKEN.test(this.description ?? '');
    }

    get createsArtifact() {
        return ARTIFACT_TOKEN.test(this.description ?? '')
            || this.tokenDefinitions.some(
                definition => ARTIFACT_TYPE.test(definition.typeLine)
            );
    }

    get createsLand() {
        return LAND_TOKEN.test(this.description ?? '');
    }

    get tokenDefinitions() {
        const tokens = this.scribe.definitions.tokens;
        return tokens.definitionsNamedIn(this.description ?? '');
    }

    get expansions() {
        this.cachedExpansions ??= this.tokenDefinitions
            .map(definition => Expansion.of(this.scribe, definition, this));
        return this.cachedExpansions;
    }
}
