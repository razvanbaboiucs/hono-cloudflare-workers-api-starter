export type RoleType = Role.USER | Role.ADMIN | Role.SUPER_ADMIN;

export enum Role {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export const Roles = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN];