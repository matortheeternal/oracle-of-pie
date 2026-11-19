import { readJson } from './shared/files.js';
import { PATHS } from './shared/paths.js';
import { createCorpusScribe } from './corpus/corpusScribe.js';
import TagTree from './tags/TagTree.js';
import { TAG_POLICIES } from './tags/policies/index.js';
import PolicyExampleCheck, { cardsByName } from './tags/policies/PolicyExampleCheck.js';

const corpus = readJson(PATHS.corpus);
const check = new PolicyExampleCheck({
    scribe: createCorpusScribe(corpus),
    tree: TagTree.load(PATHS.tags),
    cardsByName: cardsByName(corpus)
});

function report(policy) {
    console.log(`${policy.id} (${policy.kind}): ${policy.title}`);
    const outcomes = check.check(policy);
    for (const { name, tag, outcome } of outcomes)
        console.log(`  ${outcome}: ${name} ${tag}`);
    return outcomes.filter(({ outcome }) => outcome !== 'held').length;
}

const failures = TAG_POLICIES.reduce((total, policy) => total + report(policy), 0);
console.log(failures ? `${failures} policy examples failed` : 'all policy examples held');
process.exitCode = failures ? 1 : 0;
