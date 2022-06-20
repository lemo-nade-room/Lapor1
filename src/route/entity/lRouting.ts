import { HTTPMethod } from "../../method/httpMethod.ts"
import { Paths } from "./path/collection/paths.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { RoutingCollection } from "./routing/collection/routingCollection.ts"
import { LMiddlewares } from "../../middleware/entity/middlewares/lMiddlewares.ts"
import { Response } from "../../response/response.ts"
import { LRequest } from "../../request/entity/lRequest.ts"
import { WebSocketOnUpgrade } from "../../handler/socket/webSocketOnUpgrade.ts"
import { Protocol } from "../../protocol/protocol.ts"

export class LRouting {

    public constructor(
        private routingCollection: RoutingCollection
    ) {}

    public static readonly init = (): LRouting => {
        return new LRouting(new RoutingCollection([]))
    }

    public readonly setHttpHandler = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): void => {
        this.routingCollection = this.routingCollection.setHttpHandler(method, paths, middlewares, handler)
    }

    public readonly setWebSocketHandler = (paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): void => {
        this.routingCollection = this.routingCollection.setWebSocketHandler(paths, middlewares, onUpgrade)
    }

    public readonly handle = async (protocol: Protocol, method: HTTPMethod, paths: Paths, req: LRequest): Promise<Response> => {
        return await this.routingCollection.handle(protocol, method, paths, req, Paths.root)
    }
}