import { RoleType } from "./src/types/roles";

declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: number;
      email: string;
      role: RoleType;
    };
  }
}
