import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import categories from "./categories";
import { HTTPException } from "hono/http-exception";
import transactions from "./transactions";


export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((error, ctx) => {
    if (error instanceof HTTPException) {
        return error.getResponse();
    }

    return ctx.json({
        error: "Internal error"
    }, 500);
})

//eslint-disable-next-line
const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories)
    .route("/transactions", transactions);


export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;