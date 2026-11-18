export class NotImplementedError extends Error {
    constructor(member = 'Method') {
        super(`${member} not implemented.`);
        this.name = 'NotImplementedError';
    }
}

export class QueryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QueryError';
    }
}
