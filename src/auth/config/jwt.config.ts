import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_TOKEN_ISSUER,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  accessTokenTtl: parseInt(process.env.JWT_ACCES_TOKEN_TTL ?? '3600', 10),
}));
