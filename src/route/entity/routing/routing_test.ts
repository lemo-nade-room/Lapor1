import { assert, assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { Routing } from "./routing.ts"
import { UnitPath } from "../path/unit/unitPath.ts"
import { HttpHandlers } from "../../../handler/http/each/httpHandlers.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { IRoutingCollection } from "./collection/iRoutingCollection.ts"
import { Paths } from "../path/collection/paths.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { Request } from "../../../request/request.ts"
import { LRequest } from "../../../request/entity/lRequest.ts"
import { LApplication } from "../../../application/lApplication.ts"
import { HTTPHeaders } from "../../../header/httpHeaders.ts"
import { URI } from "../../../uri/uri.ts"

let log = ""

class MockRouteCollection implements IRoutingCollection {

    setHttpHandler(method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): IRoutingCollection {
        log += ` path `
        return this
    }

    handle = async (method: HTTPMethod, paths: Paths, req: Request) => "Collection Handle"
}

Deno.test("setとhandle", async () => {

    log = ""

    let routing = Routing.init({
        path: UnitPath.make('hello'),
        handlers: new HttpHandlers()
            .setHandler(HTTPMethod.GET, new LMiddlewares(), async () => "Hello")
            .setHandler(HTTPMethod.PUT, new LMiddlewares(), async () => "PUT")
            .setHandler(HTTPMethod.DELETE, new LMiddlewares(), async () => "Remove"),
        routingCollection: new MockRouteCollection()
    })

    routing = routing.setHttpHandler(HTTPMethod.POST, Paths.make([]), new LMiddlewares([]), async () => "Add")
    routing = routing.setHttpHandler(HTTPMethod.PATCH, Paths.make(['how']), new LMiddlewares([]), async () => "Oh")

    assertStrictEquals(log, " path ")

    const request = new LRequest(new LApplication(), new HTTPHeaders(), HTTPMethod.GET, new URI(Paths.root))
    let response = await routing.handle(HTTPMethod.POST, Paths.make([]), request, Paths.root)
    assertStrictEquals(response, "Add")

    response = await routing.handle(HTTPMethod.POST, Paths.make(['how']), request, Paths.root)
    assertStrictEquals(response, "Collection Handle")

})

Deno.test('isAnythingの確認', () => {
    const anythingRouting = Routing.init({ path: UnitPath.make('*') })

    const normalRouting = Routing.init({ path: UnitPath.make('hello') })

    assert(anythingRouting.isAnything)
    assert(!normalRouting.isAnything)
})

Deno.test('経由', async () => {
    const paths = Paths.make(['hello', 'world'])
    const req = new LRequest(new LApplication(), new HTTPHeaders(), HTTPMethod.GET, new URI(Paths.root))

    const routing = Routing.init({ path: UnitPath.make(':name') })
        .setHttpHandler(HTTPMethod.GET, Paths.root, new LMiddlewares(),  async () => '')

    await routing.handle(HTTPMethod.GET, Paths.root, req, paths)

    assert(req._routedPaths?.equals(
        Paths.make(['hello', 'world', ':name'])
    ))
})