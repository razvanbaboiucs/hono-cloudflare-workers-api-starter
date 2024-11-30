import { drizzle } from "drizzle-orm/d1";
import { AppContext } from "../types/appContext";

export const getDatabase = (c: AppContext) => {
  return drizzle(c.env.DB);
};