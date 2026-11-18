export default function evidenceOf(node, context) {
    const source = context.origin ?? context.sentence ?? context.ability;
    return source?.raw || node.raw;
}
