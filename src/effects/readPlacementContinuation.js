const CONJUNCTION = /^(?:,? ?and |, )/i;

export default function readPlacementContinuation(parser, Strategy, verb) {
    const connector = parser.remainingStr.match(CONJUNCTION);
    if (!connector) return null;
    const text = parser.remainingStr.slice(connector[0].length);
    const placement = parser.parseNext(verb + ' ' + text, [Strategy]);
    if (!placement?.isRecognized) return null;
    parser.remainingStr = placement.remainingStr;
    return placement;
}
