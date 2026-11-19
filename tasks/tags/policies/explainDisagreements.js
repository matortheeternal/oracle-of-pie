import { TAG_POLICIES } from './index.js';

const EXTRA_POLICIES = TAG_POLICIES.filter(policy => policy.expectsPrediction());
const OMISSION_POLICIES = TAG_POLICIES.filter(policy => !policy.expectsPrediction());

function explainEach(explained, policies, tags, faces) {
    for (const tag of tags) {
        const policy = policies.find(candidate => candidate.explains(tag, faces));
        if (policy) explained[tag] = policy.id;
    }
}

export default function explainDisagreements(faces, predicted, scryfall) {
    const explained = {};
    const extras = predicted.filter(tag => !scryfall.has(tag));
    const omissions = [...scryfall].filter(tag => !predicted.includes(tag));
    explainEach(explained, EXTRA_POLICIES, extras, faces);
    explainEach(explained, OMISSION_POLICIES, omissions, faces);
    return explained;
}
