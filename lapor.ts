import { Application } from "./src/application/application.ts"
import { LApplication } from "./src/application/lApplication.ts"
import { serve as denoServe } from "https://deno.land/std@0.138.0/http/server.ts"
import { UriConverter } from "./src/uri/convert/uriConverter.ts"
import { HTTPMethod as LHTTPMethod } from "./src/method/httpMethod.ts"
import { LRequest } from "./src/request/entity/lRequest.ts"
import { HTTPHeaders } from "./src/header/httpHeaders.ts"
import { HttpStatus } from "./src/status/httpStatus.ts"
import { Response as LResponse } from "./src/response/response.ts"
import { Responsible } from "./src/response/responsible.ts"

const uriConverter = new UriConverter()

const isResponsible = (response: LResponse): boolean => {
    const res = response as any
    return res.type === 'response'
}

export const serve = async (configure: ((app: Application) => void)): Promise<void> => {

    const app = new LApplication()
    configure(app)

    await denoServe(async (req) => {
        try {
            const pathname = new URL(req.url).pathname
            const uri = uriConverter.convert(pathname)
            const method = LHTTPMethod.read(req.method)
            const request = new LRequest(app, new HTTPHeaders(), method, uri, app.directory)
            const lRes = await app.handle(method, uri.paths, request)
            if (typeof lRes === 'string') return new Response(lRes)
            if (isResponsible(lRes)) return (lRes as Responsible).response()
            if (lRes instanceof HttpStatus) return lRes.response
            return new Response(JSON.stringify(lRes))
        } catch (e) {
            // e instanceof Abortだとなぜか効かない
            if (e.type === 'abort') {
                return e.response
            }
            console.log(e)
            return HttpStatus.badRequest.response
        }
    })
}

export type { Application } from './src/application/application.ts'
export type { Response } from './src/response/response.ts'
export type { Request } from './src/request/request.ts'
export type { Middleware } from './src/middleware/middleware.ts'
export { Abort } from './src/error/abort.ts'
export type { HttpHandler } from './src/handler/http/httpHandler.ts'
export type { WebSocketOnUpgrade } from './src/handler/webSocketOnUpgrade.ts'
export type { RouteCollection } from './src/route/routeCollection.ts'
export type { RoutesBuilder } from './src/route/routesBuilder.ts'
export type { WebSocket } from './src/websocket/webSocket.ts'
export { FileMiddleware } from './src/middleware/entity/file/fileMiddleware.ts'