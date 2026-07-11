import { UserRoles } from '@src/users/enums/user-roles.enum';

export class TokenPayloadDto {
  sub!: string;
  roles!: UserRoles[];
  jti?: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}
