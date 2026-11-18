const keepSuggesting = predicted => (predicted ? 'held' : 'regressed');
const avoidSuggesting = predicted => (predicted ? 'regressed' : 'held');
const findMissed = predicted => (predicted ? 'found' : 'missed');

export const VERDICT_QUEUES = [
    { name: 'custom-suggested-tags', correct: keepSuggesting, wrong: avoidSuggesting },
    {
        name: 'scryfall-suggested-not-tagged',
        correct: keepSuggesting,
        wrong: avoidSuggesting
    },
    {
        name: 'scryfall-tagged-not-suggested',
        correct: findMissed,
        wrong: avoidSuggesting
    }
];
