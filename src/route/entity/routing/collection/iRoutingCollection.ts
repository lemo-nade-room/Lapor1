import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"
import { HttpHandler } from "../../../../handler/http/httpHandler.ts"
import { Request } from "../../../../request/request.ts"
import { Response } from "../../../../response/response.ts"

export interface IRoutingCollection {

    setHttpHandler(method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): IRoutingCollection

    handle(method: HTTPMethod, paths: Paths, req: Request, routedPaths: Paths): Promise<Response>
}