import { Request } from "../../request/request.ts"
import { Response } from "../../response/response.ts"

export type HttpHandler = (req: Request) => Promise<Response>