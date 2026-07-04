import { UserEntity } from '../entities/user.entity';

export type UpdateUserData = Partial<
  Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'invoices'>
>;

// {
//   email?: string;
//   name?: string;
//   passwordHash?: string;
// };
