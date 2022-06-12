import { assert, assertEquals, assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { LRoutesBuilder } from "./lRoutesBuilder.ts"
import { Middleware } from "../../middleware/middleware.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { Request } from "../../request/request.ts"
import { Response } from "../../response/response.ts"
import { HTTPMethod } from "../../method/httpMethod.ts"
import { Paths } from "./path/collection/paths.ts"
import { RouteCollection } from "../routeCollection.ts"
import { RoutesBuilder } from "../routesBuilder.ts"

class MyMiddleware implements Middleware {
    constructor(
        private readonly before: string,
        private readonly after: string,
        private readonly result: { value: string }
    ) {}
    respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        this.result.value += this.before
        const res = await next(req)
        this.result.value += this.after
        return res
    }
}

class LoginController implements RouteCollection {
    boot = (routes: RoutesBuilder): void => {
        routes.get([], async (_) => "ログイン")
        routes.delete([], async (_) => "ログアウト")
    }
}

Deno.test('一連のテスト', async () => {

    const routesBuilder = LRoutesBuilder.init()
    const req: any = undefined

    const login = routesBuilder.grouped('login')
    login.register(new LoginController())

    assertStrictEquals(
        await routesBuilder.handle(HTTPMethod.GET, Paths.make(['login']), req),
        'ログイン'
    )

    assertStrictEquals(
        await routesBuilder.handle(HTTPMethod.DELETE, Paths.make(['login']), req),
        'ログアウト'
    )

    const result = { value: '' }
    const auth = routesBuilder.grouped('hello').grouped(new MyMiddleware('auth', 'clear', result))

    auth.group(new MyMiddleware('a', 'A', result), a => {
        a.post([], async (_) => 'Hello')
    })

    assertStrictEquals(
        await routesBuilder.handle(HTTPMethod.POST, Paths.make(['hello']), req),
        'Hello'
    )

    assertStrictEquals(result.value, 'authaAclear')
})