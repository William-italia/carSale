import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCIE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        jwtTtl: Number(process.env.JWT_TTL ?? '3600')
    }
})