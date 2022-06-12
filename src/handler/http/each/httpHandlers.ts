import { HttpHandler } from "../httpHandler.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { Response } from "../../../response/response.ts"
import { Request } from "../../../request/request.ts"
import { HttpMethodHandler } from "../method/httpMethodHandler.ts"
import { Abort } from "../../../error/abort.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"

type Handlers = { [method: symbol]: HttpMethodHandler }

export class HttpHandlers {

    public constructor(
        private readonly handlers: Readonly<Handlers> = {}
    ) {}

    public readonly handle = async (method: HTTPMethod, req: Request): Promise<Response> => {
        if (this.handlers[method.symbol] === undefined) throw Abort.notFound
        return await this.handlers[method.symbol].handle(req)
    }

    public readonly setHandler = (method: HTTPMethod, middlewares: LMiddlewares, handler: HttpHandler): HttpHandlers => {
        this.duplicateWarningLogger(method)
        const cloned: Handlers = Object.create(this.handlers)
        cloned[method.symbol] = new HttpMethodHandler(handler, middlewares)
        return new HttpHandlers(cloned)
    }

    private readonly duplicateWarningLogger = (method: HTTPMethod): void => {
        if (this.handlers.hasOwnProperty(method.symbol)) {
            console.log("duplicate method registered")
        }
    }
}