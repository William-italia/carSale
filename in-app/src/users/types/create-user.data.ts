import { UserEntity } from '../entities/user.entity';

export type CreateUserData = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt' | 'invoices'
>;
// {
//   email: string;
//   name: string;
//   passwordHash: string;

//   active: boolean;
//   tokenHash: string | null;
// };
