export enum UserRoles {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  DELIVERY = 'DELIVERY',
  MANAGER = 'MANAGER',
  BOSS = 'BOSS',

  // swa roles
  ANONYMOUS = 'anonymous',
  AUTHENTICATED = 'authenticated',
}

export const UserRoleLevel: Record<UserRoles, number> = {
  anonymous: 0,
  authenticated: 1,
  CLIENT: 2,
  EMPLOYEE: 3,
  DELIVERY: 4,
  MANAGER: 5,
  BOSS: 6,
};
