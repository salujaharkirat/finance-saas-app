import { Hono } from "hono";
import { handle } from "hono/vercel";
import accounts from "./accounts";
import { HTTPException } from "hono/http-exception";


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
    .route("/accounts", accounts);


export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;