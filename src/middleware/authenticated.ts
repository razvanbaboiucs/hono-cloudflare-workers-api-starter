import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types";
import { UserJwtPayload } from "../types/userJwtPayload";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { RoleType } from "../types/roles";
import { AppContext } from "../types/appContext";

export const authenticated = createMiddleware(async (c, next) => {
    const token = c.req.header("Authorization")?.split(" ")[1]; // Authorization: Bearer <token>

    if (!token) {
        console.error("No token provided");
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    const payload = await getPayloadFromToken(token, c);

    if (!payload?.email) {
        console.error("Invalid token");
        throw new HTTPException(401, { message: "Unauthorized: Invalid token" });
    }

    const db = drizzle(c.env.DB);
    const user = await db.select().from(users).where(eq(users.email, payload.email));

    if (user.length === 0) {
        console.error("User not found");
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    const currentUser = {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role as RoleType
    };

    c.set("user", {...currentUser}); // set current user in context

    await next();
});

async function getPayloadFromToken(token: string, c: AppContext) {
    try {
        return await verify(token, c.env.JWT_SECRET) as UserJwtPayload;
    }
    catch (error) {
        if (error instanceof JwtTokenInvalid) {
            console.error("Invalid token");
            throw new HTTPException(401, { message: "Unauthorized: Invalid token" });
        }
        if (error instanceof JwtTokenExpired) {
            console.error("Token expired");
            throw new HTTPException(401, { message: "Unauthorized: Token expired" });
        }
        console.error("Error while authenticating user", error);
        throw new HTTPException(401, { message: "Unauthorized" });
    }
}