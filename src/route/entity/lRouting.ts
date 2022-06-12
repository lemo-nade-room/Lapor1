import { HTTPMethod } from "../../method/httpMethod.ts"
import { Paths } from "./path/collection/paths.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { Routing } from "./routing/routing.ts"
import { RoutingCollection } from "./routing/collection/routingCollection.ts"
import { LMiddlewares } from "../../middleware/entity/middlewares/lMiddlewares.ts"

export class LRouting {

    public constructor(
        private routing: Routing
    ) {}

    public static readonly init = (): LRouting => {
        return new LRouting(Routing.init(new RoutingCollection()))
    }

    public readonly setHttpHandler = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): void => {
        this.routing = this.routing.setHttpHandler(method, paths, middlewares, handler)
    }

}