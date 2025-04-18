import { categories, insertCategorySchema } from "@/db/schema";
import { db } from "@/db/drizzle";
import { Hono } from "hono";
import { z } from "zod";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createId } from "@paralleldrive/cuid2";
import { HTTPException} from "hono/http-exception";
import { and, eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

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
    id: categories.id,
    name: categories.name,
  })
  .from(categories)
  .where(eq(categories.userId, auth.userId));
  return ctx.json({data});
})
.get(
  "/:id",
  clerkMiddleware(),
  zValidator("param", z.object({
    id: z.string()
  })),
  async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid("param");

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Unauthorized"}, 401)
      });
    }

    const [data] = await db
    .select({
      id: categories.id,
      name: categories.name
    })
    .from(categories)
    .where(
      and(
        eq(categories.userId, auth.userId),
        eq(categories.id, id)
      )
    );
    
    if (!data) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Not found"}, 404)
      });
    }
    return ctx.json({ data });
  }
)
.post(
  '/', 
  clerkMiddleware(),
  zValidator("json", insertCategorySchema.pick({
    name: true,
  })),
  async(ctx) => {
    const auth = getAuth(ctx);
    const values = ctx.req.valid("json");
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Unauthorized"}, 401)
      });
    }

    const [data] = await db.insert(categories).values({
      id: createId(),
      userId: auth.userId,
      ...values,
    }).returning();
    
    return ctx.json({ data });
})
.post(
  '/bulk-delete',
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      ids: z.array(z.string())
    })
  ),
  async (ctx) => {
    const auth = getAuth(ctx);
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Unauthorized"}, 401)
      });
    }
    const values = ctx.req.valid('json');
    const data = await db
    .delete(categories)
    .where(
      and(
        eq(categories.userId, auth.userId),
        inArray(categories.id, values.ids)
      )
    )
    .returning({
      id: categories.id
    });

    return ctx.json({ data });
  }
)
.patch(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string()
    })
  ),
  zValidator(
    "json",
    insertCategorySchema.pick({
      name: true,
    })
  ),
  async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid("param");
    const values = ctx.req.valid("json");
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Unauthorized"}, 401)
      });
    }

    const [data] = await db
    .update(categories)
    .set(values)
    .where(
      and(
        eq(categories.userId, auth.userId),
        eq(categories.id, id)
      )
    )
    .returning();

    if (!data) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Data not found"}, 401)
      });
    }

    return ctx.json({ data });

  }
)
.delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    "param",
    z.object({
      id: z.string()
    })
  ),
  async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid("param");
    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Unauthorized"}, 401)
      });
    }

    const [data] = await db
    .delete(categories)
    .where(
      and(
        eq(categories.userId, auth.userId),
        eq(categories.id, id)
      )
    )
    .returning({
      id: categories.id
    });

    if (!data) {
      throw new HTTPException(401, {
        res: ctx.json({ error: "Data not found"}, 401)
      });
    }

    return ctx.json({ data });

  }
)



export default app;