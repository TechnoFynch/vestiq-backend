import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
export const Roles = (role: string) => SetMetadata('role', role);
