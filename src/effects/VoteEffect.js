import Effect from './Effect.js';

const VOTE = new RegExp(
    '^(?:starting with you, )?(?:each player )?(?<secret>secretly )?votes? for '
    + '(?<options>[^,.]+? or [^,.]+?|(?:an?|another|up to one) [^,.]+?)(?=$|[,.])', 'i'
);
const REVEALED = /^, then those votes are revealed/i;
const OPTION_JOINER = / or /i;

export default class VoteEffect extends Effect {
    static get pattern() {
        return VOTE;
    }

    parseArguments(match) {
        this.isSecret = Boolean(match.groups.secret);
        this.options = match.groups.options.split(OPTION_JOINER);
        this.consumeText(REVEALED);
    }

    get votesOnObject() {
        return this.options.length === 1;
    }
}
