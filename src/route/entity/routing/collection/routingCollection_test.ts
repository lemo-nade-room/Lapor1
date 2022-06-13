import { assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { RoutingCollection } from "./routingCollection.ts"
import { Routing } from "../routing.ts"
import { UnitPath } from "../../path/unit/unitPath.ts"
import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"
import { LRequest } from "../../../../request/entity/lRequest.ts"
import { LApplication } from "../../../../application/lApplication.ts"
import { HTTPHeaders } from "../../../../header/httpHeaders.ts"
import { URI } from "../../../../uri/uri.ts"

Deno.test('RoutingCollection Test', async () => {
    const collection = new RoutingCollection([
        Routing.init({ path: UnitPath.make('hello') }),
        Routing.init({
            path: UnitPath.make('morning'),
            routingCollection: new RoutingCollection([
                Routing.init({ path: UnitPath.make('night') })
            ])
        })
    ])
        .setHttpHandler(HTTPMethod.GET, Paths.make(['hello']), new LMiddlewares(), async () => 'hello response')
        .setHttpHandler(HTTPMethod.PATCH, Paths.make(['morning']), new LMiddlewares(), async () => 'morning response')
        .setHttpHandler(HTTPMethod.DELETE, Paths.make(['afternoon']), new LMiddlewares(), async () => 'afternoon')
        .setHttpHandler(HTTPMethod.PUT, Paths.make(['morning', 'night']), new LMiddlewares(), async () => 'morning Night')
        .setHttpHandler(HTTPMethod.POST, Paths.make(['good', 'bad', 'middle']), new LMiddlewares(), async () => 'God')

    const req = new LRequest(new LApplication(), new HTTPHeaders(), HTTPMethod.GET, new URI(Paths.root))
    let res = await collection.handle(HTTPMethod.GET, Paths.make(['hello']), req, Paths.make([]))
    assertStrictEquals(res, 'hello response')

    res = await collection.handle(HTTPMethod.PATCH, Paths.make(['morning']), req, Paths.make([]))
    assertStrictEquals(res, 'morning response')

    res = await collection.handle(HTTPMethod.DELETE, Paths.make(['afternoon']), req, Paths.make([]))
    assertStrictEquals(res, 'afternoon')

    res = await collection.handle(HTTPMethod.PUT, Paths.make(['morning', 'night']), req, Paths.make([]))
    assertStrictEquals(res, 'morning Night')

    res = await collection.handle(HTTPMethod.POST, Paths.make(['good', 'bad', 'middle']), req, Paths.make([]))
    assertStrictEquals(res, 'God')
})