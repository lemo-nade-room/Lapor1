import { assertEquals, } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { Middleware } from "../../middleware.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { Request } from "../../../request/request.ts"
import { Response } from "../../../response/response.ts"
import { LMiddlewares } from "./lMiddlewares.ts"

let result = ""

class A implements Middleware {
    respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        result += "a"
        const response = await next(req)
        result += "A"
        return response
    }
}
class B implements Middleware {
    respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        result += "b"
        const response = await next(req)
        result += "B"
        return response
    }
}
class C implements Middleware {
    respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        result += "c"
        const response = await next(req)
        result += "C"
        return response
    }
}

const handler: HttpHandler = async (_) => {
    result += '|'
    return ""
}

const request: any = undefined

Deno.test("Middleware Handle Test", async () => {
    result = ""

    const middlewares = new LMiddlewares()
    middlewares.use(new A())
    middlewares.use(new B())
    middlewares.use(new C())

    await middlewares.httpHandle(request, handler)

    assertEquals(result, "abc|CBA")
})

Deno.test("usedのテスト", async () => {
    result = ""
    const middlewares = new LMiddlewares()
        .used(new A())
        .used(new B())
        .used(new C())

    await middlewares.httpHandle(request, handler)

    assertEquals(result, "abc|CBA")
})