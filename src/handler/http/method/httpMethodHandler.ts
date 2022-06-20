import { HttpHandler } from "../httpHandler.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { Request } from "../../../request/request.ts"
import { Response } from "../../../response/response.ts"

export class HttpMethodHandler {
    public constructor(
        private readonly handler: HttpHandler,
        private readonly middlewares: LMiddlewares
    ) {}

    public readonly handle = (req: Request): Promise<Response> => {
        return this.middlewares.handle(req, this.handler)
    }
}