import { Hono } from "hono";
import { authenticated } from "../middleware/authenticated";
import { admin } from "../middleware/admin";
import { HTTPException } from "hono/http-exception";
import { getDatabase } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserType } from "../types/user";
import { Role, Roles, RoleType } from "../types/roles";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("/*", async (c, next) => authenticated(c, next));

// Routes
app.get("/current", async (c) => {
    const user = c.get("user"); // Get the user from the context
    return c.json({
        ...user
    })
});

// Admin routes
app.use("/", async (c, next) => admin(c, next));
app.use("/:id", async (c, next) => admin(c, next));

app.get("/", async (c) => {
    const db = getDatabase(c);
    const allUsers = await db.select().from(users);
    const usersData = allUsers.map(mapUserData);
    return c.json(usersData);
});

app.get("/:id", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (id === undefined ||  id < 0) {
        console.error("Invalid id provided", id);
        throw new HTTPException(400, { message: "Invalid id provided" });
    }
    const db = getDatabase(c);
    const user = await db.select().from(users).where(eq(users.id, id));
    if (user.length === 0) {
        console.error("User not found");
        throw new HTTPException(400, { message: "User not found" });
    }
    const userData = mapUserData(user[0]);
    return c.json({
        ...userData
    })
});

app.patch("/:id", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (id === undefined ||  id < 0) {
        console.error("Invalid id provided", id);
        throw new HTTPException(400, { message: "Invalid id provided" });
    }
    const db = getDatabase(c);
    const user = await db.select().from(users).where(eq(users.id, id));
    if (user.length === 0) {
        console.error("User not found");
        throw new HTTPException(400, { message: "User not found" });
    }
    const { email, role } = await c.req.json();
    if (!email && !role) {
        console.error("Email or role is empty");
        throw new HTTPException(400, { message: "Email or role is empty" });
    }
    if (email && email.trim() === "") {
        console.error("Email is empty");
        throw new HTTPException(400, { message: "Email is empty" });
    }
    if (role && (role.trim() === "" || Roles.indexOf(role as RoleType) === -1)) {
        console.error("Role is not valid");
        throw new HTTPException(400, { message: "Role is not valid" });
    }

    if (email && role) {
        await db.update(users).set({email, role}).where(eq(users.id, id));
    }
    if (email) {
        await db.update(users).set({email}).where(eq(users.id, id));
    }
    if (role) {
        await db.update(users).set({role}).where(eq(users.id, id));
    }
    
    return c.text("User updated successfully");
});

const mapUserData = (user: UserType) => ({
    id: user.id,
    email: user.email,
    role: user.role
})

export default app;

