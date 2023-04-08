import { Role } from '@prisma/client';

export class JwtPayload {
  sub: number;
  email: string;
  role: Role;
}
