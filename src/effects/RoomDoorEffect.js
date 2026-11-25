import ObjectEffect from './ObjectEffect.js';

const DOOR = /^(?<operation>lock or unlock|unlock|lock) (?:a|one) (?:locked )?door of /i;

export default class RoomDoorEffect extends ObjectEffect {
    static get pattern() {
        return DOOR;
    }

    parseArguments(match) {
        this.operation = match.groups.operation.toLowerCase();
        super.parseArguments();
    }
}
