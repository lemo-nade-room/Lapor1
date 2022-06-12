import { assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { RoutingCollection } from "./routingCollection.ts"
import { Routing } from "../routing.ts"
import { UnitPath } from "../../path/unit/unitPath.ts"
import { HttpHandlers } from "../../../../handler/http/each/httpHandlers.ts"
import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"

Deno.test('RoutingCollection Test', async () => {
    const collection = new RoutingCollection([
        new Routing(UnitPath.make('hello'), new HttpHandlers(), new RoutingCollection([])),
        new Routing(UnitPath.make('morning'), new HttpHandlers(), new RoutingCollection([
            new Routing(UnitPath.make('night'), new HttpHandlers(), new RoutingCollection([])),
        ]))
    ])
        .setHttpHandler(HTTPMethod.GET, Paths.make(['hello']), new LMiddlewares(), async () => 'hello response')
        .setHttpHandler(HTTPMethod.PATCH, Paths.make(['morning']), new LMiddlewares(), async () => 'morning response')
        .setHttpHandler(HTTPMethod.DELETE, Paths.make(['afternoon']), new LMiddlewares(), async () => 'afternoon')
        .setHttpHandler(HTTPMethod.PUT, Paths.make(['morning', 'night']), new LMiddlewares(), async () => 'morning Night')
        .setHttpHandler(HTTPMethod.POST, Paths.make(['good', 'bad', 'middle']), new LMiddlewares(), async () => 'God')

    const req: any = undefined
    let res = await collection.handle(HTTPMethod.GET, Paths.make(['hello']), req)
    assertStrictEquals(res, 'hello response')

    res = await collection.handle(HTTPMethod.PATCH, Paths.make(['morning']), req)
    assertStrictEquals(res, 'morning response')

    res = await collection.handle(HTTPMethod.DELETE, Paths.make(['afternoon']), req)
    assertStrictEquals(res, 'afternoon')

    res = await collection.handle(HTTPMethod.PUT, Paths.make(['morning', 'night']), req)
    assertStrictEquals(res, 'morning Night')

    res = await collection.handle(HTTPMethod.POST, Paths.make(['good', 'bad', 'middle']), req)
    assertStrictEquals(res, 'God')
})