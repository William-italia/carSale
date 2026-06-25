export type CreateUserData = {
    email: string;
    name: string;
    passwordHash: string;
    tokenHash: string | null;
}