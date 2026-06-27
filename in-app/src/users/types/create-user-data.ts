export type CreateUserData = {
  email: string;
  name: string;
  passwordHash: string;

  active: boolean;
  tokenHash: string | null;
};
