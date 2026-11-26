const SELF_PUMP_ABILITY = {
    kind: 'ActivatedAbility',
    cost: { includesTap: false, removesSource: false, removesCounters: false }
};

function activatedPump(modifier) {
    return {
        kind: 'ModifyPTEffect',
        modifier,
        subject: { refersToSelf: true },
        context: { granted: false, ability: SELF_PUMP_ABILITY }
    };
}

export const PUMP_TAGS = [
    { tag: 'firebreathing', match: activatedPump({ isPowerOnlyBoost: true }) },
    { tag: 'shade-pump', match: activatedPump({ isEvenBoost: true }) }
];
