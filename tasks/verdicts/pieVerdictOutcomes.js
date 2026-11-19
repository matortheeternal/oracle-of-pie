export const PIE_VERDICT_OUTCOMES = [
    { name: 'held', applies: verdict => verdict.isSatisfied && !verdict.hasChanged },
    { name: 'known', applies: verdict => verdict.isAcceptedDisagreement },
    { name: 'fixed', applies: verdict => verdict.isSatisfied && !verdict.wasSatisfied },
    { name: 'changed', applies: verdict => verdict.isSatisfied },
    { name: 'regressed', applies: () => true }
];

export const FAILING_OUTCOMES = new Set(['changed', 'regressed']);
