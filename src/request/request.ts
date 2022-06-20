import { Application } from "../application/application.ts";
import { HTTPMethod } from "../method/httpMethod.ts";
import { URI } from "../uri/uri.ts";
import { HTTPHeaders } from "../header/httpHeaders.ts";
import { Route } from "../route/route.ts";
import { Params } from "./entity/params/params.ts"
import { Sessions } from "../session/sessions.ts"
import { DenoRequest } from "./denoRequest.ts"
import { Protocol } from "../protocol/protocol.ts"

export interface Request {
    application: Application
    method: HTTPMethod
    url: URI
    headers: HTTPHeaders
    protocol: Protocol
    route?: Route,
    denoRequest: DenoRequest

    get content(): string | Record<string | number, unknown>
    get query(): Record<string, string>
    get parameters(): Params
    get sessions(): Sessions
}