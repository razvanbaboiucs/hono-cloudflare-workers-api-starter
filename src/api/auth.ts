import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { generateJwtToken } from "../utils/generateJwtToken";
import * as bcrypt from "bcryptjs";
import { Role, RoleType } from "../types/roles";
import { getDatabase } from "../db";
import { AppContext } from "../types/appContext";

const app = new Hono<{ Bindings: Env }>();

// Routes
app.post("/login", async (c) => {
  const { email, password }: { email: string; password: string } =
    await c.req.json();
  if (email.trim() === "" || password.trim() === "") {
    console.error("Email or password is empty");
    throw new HTTPException(400, { message: "Email or password is empty" });
  }

  const db = getDatabase(c);
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    console.error("User not found");
    throw new HTTPException(400, { message: "User not found" });
  }

  if (!bcrypt.compareSync(password, user[0].password)) {
    console.error("Password or email is incorrect");
    throw new HTTPException(400, { message: "Password or email is incorrect" });
  }

  const token = await generateJwtToken(email, c);
  c.header("Authorization", `Bearer ${token}`);

  return c.text("User logged in successfully");
});

app.post("/register", async (c) => {
  await registerUser(c, Role.USER);

  return c.text("User created successfully");
});

app.post("/register/super-admin", async (c) => {
  const db = getDatabase(c);
  const superAdmin = await db.select().from(users).where(eq(users.role, Role.SUPER_ADMIN));

  if (superAdmin.length > 0) {
    console.error("Super admin already exists");
    throw new HTTPException(400, { message: "Super admin already exists" });
  }

  await registerUser(c, Role.SUPER_ADMIN);

  return c.text("Super admin created successfully");
});

async function registerUser(c: AppContext, role: RoleType) {
  const { email, password }: { email: string; password: string } =
    await c.req.json();

  if (email.trim() === "" || password.trim() === "") {
    console.error("Email or password is empty");
    throw new HTTPException(400, { message: "Email or password is empty" });
  }
  
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const db = getDatabase(c);
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length > 0) {
    console.error("User already exists");
    throw new HTTPException(400, { message: "User already exists" });
  }

  await db
    .insert(users)
    .values({ email, password: hashedPassword, role });

  const token = await generateJwtToken(email, c);
  c.header("Authorization", `Bearer ${token}`);
}

export default app;
