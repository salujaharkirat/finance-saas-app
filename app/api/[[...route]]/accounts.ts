import { accounts } from "@/db/schema";
import { db } from "@/db/drizzle";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { HTTPException} from "hono/http-exception";
import { eq } from "drizzle-orm";

const app = new Hono()
.get("/", clerkMiddleware(), async (ctx) => {
  const auth = getAuth(ctx);
  if (!auth?.userId) {
    throw new HTTPException(401, {
      res: ctx.json({ error: "Unauthorized"}, 401)
    });
  }
  
  const data = await db
  .select({
    id: accounts.id,
    name: accounts.name,
  })
  .from(accounts)
  .where(eq(accounts.userId, auth.userId));
  return ctx.json({data});
});


export default app;