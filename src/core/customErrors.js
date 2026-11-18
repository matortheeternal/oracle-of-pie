export class NotImplementedError extends Error {
    constructor(member = 'Method') {
        super(`${member} not implemented.`);
        this.name = 'NotImplementedError';
    }
}
