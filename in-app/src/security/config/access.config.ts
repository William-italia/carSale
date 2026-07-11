import { registerAs } from '@nestjs/config';

export default registerAs('access', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCIE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    expiresIn: Number(process.env.JWT_TTL ?? '300'),
  };
});
