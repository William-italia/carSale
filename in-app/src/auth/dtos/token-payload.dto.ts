export class TokenPayloadDto {
  sub!: string;
  // role!: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}
