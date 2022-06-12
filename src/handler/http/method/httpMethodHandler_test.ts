import { assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { HttpMethodHandler } from "./httpMethodHandler.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { Middleware } from "../../../middleware/middleware.ts"
import { HttpHandler } from "../httpHandler.ts"
import { Request } from "../../../request/request.ts"
import { Response } from "../../../response/response.ts"

class MyMiddleware implements Middleware {
    respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        const res = await next(req)
        return typeof res === 'string' ? res + 'Hello' : res
    }
}

Deno.test('Middlewareとハンドラのテスト', async () => {
    const handlers = new HttpMethodHandler(
        async (_) => "こんにちは",
        new LMiddlewares([new MyMiddleware()])
    )

    const request: any = undefined
    const response = await handlers.handle(request)
    assertStrictEquals(response, 'こんにちはHello')
})