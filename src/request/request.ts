import { Application } from "../application/application.ts";
import { HTTPMethod } from "../method/httpMethod.ts";
import { URI } from "../uri/uri.ts";
import { HTTPHeaders } from "../header/httpHeaders.ts";
import { Route } from "../route/route.ts";
import { Params } from "./entity/params/params.ts"

export interface Request {
    application: Application
    method: HTTPMethod
    url: URI
    headers: HTTPHeaders
    route?: Route

    get content(): string | Record<string | number, unknown>
    get query(): Record<string, string>
    get parameters(): Params
}