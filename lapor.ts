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
import { LCookie } from "./src/cookie/lCookie.ts"
import { SessionStorage } from "./src/session/storage/sessionStorage.ts"
import { Protocol } from "./src/protocol/protocol.ts"
import { LSessions } from "./src/session/entity/lSessions.ts"

const uriConverter = new UriConverter()

const isResponsible = (response: LResponse): boolean => {
    const res = response as any
    return res.type === 'responsible'
}

const convertResponse = (lRes: LResponse): Response => {
    if (typeof lRes === 'string') return new Response(lRes)
    if (isResponsible(lRes)) {
        return (lRes as Responsible).response()
    }
    return new Response(JSON.stringify(lRes))
}

const addCookie = (res: Response, sessions: LSessions): Response => {
    try {
        res.headers.set("Set-Cookie", `session_id=${sessions.uuid}; HttpOnly; SameSite=Lax`)
        return res
    } catch (e) {
        return res
    }
}
export const serve = async (configure: ((app: Application) => void)): Promise<void> => {

    const app = new LApplication()
    configure(app)

    const storage = new SessionStorage()

    await denoServe(async (req) => {
        try {
            const cookie = new LCookie(req.headers.get('Cookie') ?? '')

            const sessions = storage.get(cookie.sessionId)

            const url = new URL(req.url)
            const pathname = url.pathname
            const protocol = new Protocol(req.headers.get('connection') === 'Upgrade' ? 'ws:' : 'http:')
            const uri = uriConverter.convert(pathname)
            const text = await req.text()
            const content: Record<string | number | symbol, unknown> = text ? JSON.parse(text) : {}
            const method = LHTTPMethod.read(req.method)
            const request = new LRequest(app, new HTTPHeaders(), method, uri, content, protocol, sessions, app.directory, req)
            const lRes = await app.handle(protocol, method, uri.paths, request)

            const response = convertResponse(lRes)
            addCookie(response, sessions)
            return response
        } catch (e) {
            // e instanceof Abortだとなぜか効かない
            if (e.type === 'abort') {
                return e.response
            }
            console.trace(e)
            return HttpStatus.badRequest.response
        }
    })
}

export type { Application } from './src/application/application.ts'
export type { Response } from './src/response/response.ts'
export type { Request } from './src/request/request.ts'
export type { Middleware } from './src/middleware/middleware.ts'
export { Abort } from './src/error/abort.ts'
export { HttpStatus } from './src/status/httpStatus.ts'
export type { HttpHandler } from './src/handler/http/httpHandler.ts'
export type { WebSocketOnUpgrade } from './src/handler/socket/webSocketOnUpgrade.ts'
export type { RouteCollection } from './src/route/routeCollection.ts'
export type { RoutesBuilder } from './src/route/routesBuilder.ts'
export type { WebSocket } from './src/websocket/webSocket.ts'
export { FileMiddleware } from './src/middleware/entity/file/fileMiddleware.ts'