import { Middleware } from "../../middleware/middleware.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { Request } from "../../request/request.ts"
import { Response } from "../../response/response.ts"

export class SessionMiddleware implements Middleware {
    public readonly respond = async (req: Request, next: HttpHandler): Promise<Response> => {
        return await next(req)
    }
}