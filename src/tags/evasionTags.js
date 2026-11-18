export const EVASION_TAGS = [
    {
        tag: 'unblockable',
        match: {
            kind: 'CantEffect',
            makesUnblockable: true,
            subject: { refersToSelf: true },
            context: { granted: false, expansion: null }
        }
    }
];
