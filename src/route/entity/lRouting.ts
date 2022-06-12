import { HTTPMethod } from "../../method/httpMethod.ts"
import { Paths } from "./path/collection/paths.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { Routing } from "./routing/routing.ts"
import { RoutingCollection } from "./routing/collection/routingCollection.ts"
import { LMiddlewares } from "../../middleware/entity/middlewares/lMiddlewares.ts"
import { Request } from "../../request/request.ts"
import { Response } from "../../response/response.ts"

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

    public readonly handle = async (method: HTTPMethod, paths: Paths, req: Request): Promise<Response> => {
        return await this.routing.handle(method, paths, req)
    }
}