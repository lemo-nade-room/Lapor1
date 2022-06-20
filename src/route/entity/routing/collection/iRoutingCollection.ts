import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"
import { HttpHandler } from "../../../../handler/http/httpHandler.ts"
import { Request } from "../../../../request/request.ts"
import { Response } from "../../../../response/response.ts"
import { WebSocketOnUpgrade } from "../../../../handler/socket/webSocketOnUpgrade.ts"
import { Protocol } from "../../../../protocol/protocol.ts"

export interface IRoutingCollection {

    setHttpHandler(method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): IRoutingCollection

    setWebSocketHandler(paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): IRoutingCollection

    handle(protocol: Protocol, method: HTTPMethod, paths: Paths, req: Request, routedPaths: Paths): Promise<Response>
}