import { sign } from "hono/jwt";
import { UserJwtPayload } from "../types/userJwtPayload";
import { AppContext } from "../types/appContext";

export const generateJwtToken = async (email: string, c: AppContext) => {
  return await sign(
    {
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12, // Expires in 12 hours
    } as UserJwtPayload,
    c.env.JWT_SECRET
  );
};
