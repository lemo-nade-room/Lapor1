import { assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { Routing } from "./routing.ts"
import { UnitPath } from "../path/unit/unitPath.ts"
import { HttpHandlers } from "../../../handler/http/each/httpHandlers.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { IRoutingCollection } from "./collection/iRoutingCollection.ts"
import { Paths } from "../path/collection/paths.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { Request } from "../../../request/request.ts"

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

    let routing = new Routing(
        UnitPath.make("hello"),
        new HttpHandlers()
            .setHandler(HTTPMethod.GET, new LMiddlewares(), async () => "Hello")
            .setHandler(HTTPMethod.PUT, new LMiddlewares(), async () => "PUT")
            .setHandler(HTTPMethod.DELETE, new LMiddlewares(), async () => "Remove"),
        new MockRouteCollection()
    )

    routing = routing.setHttpHandler(HTTPMethod.POST, Paths.make([]), new LMiddlewares([]), async () => "Add")
    routing = routing.setHttpHandler(HTTPMethod.PATCH, Paths.make(['how']), new LMiddlewares([]), async () => "Oh")

    assertStrictEquals(log, " path ")

    const request: any = undefined
    let response = await routing.handle(HTTPMethod.POST, Paths.make([]), request)
    assertStrictEquals(response, "Add")

    response = await routing.handle(HTTPMethod.POST, Paths.make(['how']), request)
    assertStrictEquals(response, "Collection Handle")

})