import TriggerEvent from './TriggerEvent.js';

const UNLOCK_ACTION = '(?:unlocks? this door|(?<fullRoom>fully unlocks? a Room))';
const UNLOCKS_ROOM = new RegExp('^(?<subject>.+?) ' + UNLOCK_ACTION + '\\b', 'i');

export default class UnlocksRoomEvent extends TriggerEvent {
    static get pattern() {
        return UNLOCKS_ROOM;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isFullRoom = Boolean(match.groups.fullRoom);
    }

    get isRepeatable() {
        return this.isFullRoom;
    }
}
