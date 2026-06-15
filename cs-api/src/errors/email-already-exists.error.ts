export class EmailAlreadyExistsError extends Error {
    constructor() {
        super('An account already exists with that email address');
    }
}