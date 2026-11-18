import ColorPolicy from './ColorPolicy.js';
import MonocolorPolicy from './MonocolorPolicy.js';
import GoldPolicy from './GoldPolicy.js';

const PAYMENT_POLICIES = [MonocolorPolicy, GoldPolicy];

function judgePayment(payment, tiers) {
    const policy = PAYMENT_POLICIES.find(candidate => candidate.appliesTo(payment));
    return policy?.judge(payment, tiers) ?? null;
}

function worstVerdict(verdicts) {
    const offending = [...new Set(verdicts.flatMap(verdict => verdict.offending))];
    const tier = verdicts.map(verdict => verdict.tier)
        .reduce((worst, each) => (each.isWorseThan(worst) ? each : worst));
    return { offending, tier };
}

export default class HybridPolicy extends ColorPolicy {
    static get id() {
        return 'hybrid';
    }

    static appliesTo(cardColors) {
        return cardColors.isHybrid;
    }

    static judge(cardColors, tiers) {
        const verdicts = [];
        for (const payment of cardColors.paymentOptions) {
            const verdict = judgePayment(payment, tiers);
            if (verdict) verdicts.push(verdict);
        }
        return verdicts.length ? worstVerdict(verdicts) : null;
    }
}
