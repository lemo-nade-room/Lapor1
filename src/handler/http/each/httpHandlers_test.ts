import { assertEquals, } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { HttpHandlers } from "./httpHandlers.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"

const request: any = ""

Deno.test("handle", async () => {
    const handlers = new HttpHandlers()
        .setHandler(HTTPMethod.GET, new LMiddlewares(), async () => "Hello")
        .setHandler(HTTPMethod.POST, new LMiddlewares(), async () => "Post")
        .setHandler(HTTPMethod.PUT, new LMiddlewares(), async () => "PUT")
        .setHandler(HTTPMethod.PATCH, new LMiddlewares(), async () => "Patch")
        .setHandler(HTTPMethod.DELETE, new LMiddlewares(), async () => "Remove")

    assertEquals("Hello", await handlers.handle(HTTPMethod.GET, request))
    assertEquals("Post", await handlers.handle(HTTPMethod.POST, request))
    assertEquals("PUT", await handlers.handle(HTTPMethod.PUT, request))
    assertEquals("Patch", await handlers.handle(HTTPMethod.PATCH, request))
    assertEquals("Remove", await handlers.handle(HTTPMethod.DELETE, request))
})