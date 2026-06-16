export class UnauthorizedError extends Error {
    constructor() {
        super('Email or Password invalid');
    }
}