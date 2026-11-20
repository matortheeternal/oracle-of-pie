import Sentence from '../sentences/Sentence.js';

function enclosingSentence(node, context) {
    return context.sentence ?? (node instanceof Sentence ? node : null);
}

export default function evidenceOf(node, context) {
    const source = context.origin ?? enclosingSentence(node, context) ?? context.ability;
    return source?.raw || node.raw;
}
