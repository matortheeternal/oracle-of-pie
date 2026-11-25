import Effect from './Effect.js';

const VOTE = new RegExp(
    '^(?:starting with you, )?(?:each player )?(?<secret>secretly )?votes? for '
    + '(?<options>[^,.]+? or [^,.]+?|(?:an?|another|up to one) [^,.]+?)(?=$|[,.])', 'i'
);
const REVEALED = /^, then those votes are revealed/i;
const OPTION_JOINER = / or /i;
const ADDITIONAL_VOTE = /^votes? (?:an additional time|twice)\b/i;

export default class VoteEffect extends Effect {
    static get pattern() {
        return VOTE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(ADDITIONAL_VOTE);
    }

    parseArguments(match) {
        this.isSecret = Boolean(match.groups?.secret);
        this.options = match.groups?.options.split(OPTION_JOINER) ?? [];
        this.additionalVotes = this.options.length ? 0 : 1;
        this.consumeText(REVEALED);
    }

    get votesOnObject() {
        return this.options.length === 1;
    }
}
