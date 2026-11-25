import ActionEvent from './ActionEvent.js';

const ATTACHED = /^(?<subject>.+?) becomes? (?<unattached>un)?attached (?:to|from)\b/i;

export default class BecomesAttachedEvent extends ActionEvent {
    static get pattern() {
        return ATTACHED;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isUnattached = Boolean(match.groups.unattached);
    }

    parseObjectPhrase() {
        const phrase = super.parseObjectPhrase();
        if (phrase && this.isUnattached && this.isSelf) phrase.wasAttachmentHost = true;
        return phrase;
    }
}
