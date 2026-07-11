import { registerAs } from '@nestjs/config';

export default registerAs('refresh', () => {
  return {
    secret: process.env.JWT_REFRESH_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCIE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    expiresIn: Number(process.env.JWT_REFRESH_TTL ?? '604800'),
  };
});
