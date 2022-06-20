import { Request } from "../request/request.ts"
import { Response } from "../response/response.ts"
import { HttpHandler } from "../handler/http/httpHandler.ts"

export interface Middleware {
    respond(req: Request, next: HttpHandler): Promise<Response>
}