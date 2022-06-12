import { Middleware } from "../../middleware.ts"
import { Middlewares } from "../../middlewares.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import  { Request } from "../../../request/request.ts"
import { Response } from "../../../response/response.ts"

type Responder = (req: Request, handler: HttpHandler) => Promise<Response>

export class LMiddlewares implements Middlewares {

    public constructor(
        private middlewares: Middleware[] = []
    ) {}

    public readonly use = (middleware: Middleware): void => {
        this.middlewares.push(middleware)
    }

    public readonly used = (middleware: Middleware): LMiddlewares => {
        return new LMiddlewares(this.middlewares.concat([middleware]))
    }

    public get httpHandle(): Responder {
        return this.middlewares
            .slice()
            .reverse()
            .reduce<Responder>(
                (previousResponder, middleware) => {
                    return async (req: Request, handler: HttpHandler) => {
                        return await middleware.respond(
                            req,
                            request => previousResponder(request, handler)
                        )
                    }
                },
                async (req: Request, handler: HttpHandler) => await handler(req)
            )
    }
}

