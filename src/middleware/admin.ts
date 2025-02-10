
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Role } from "../types/roles";

export const admin = createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
        console.error("User is not admin");
        throw new HTTPException(403, { message: "Forbidden" });
    }
    await next();
});