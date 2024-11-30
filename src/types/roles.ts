export type RoleType = Role.USER | Role.ADMIN;

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export const Roles = [Role.USER, Role.ADMIN];