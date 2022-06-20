import { IRoutingCollection } from "./iRoutingCollection.ts"
import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"
import { HttpHandler } from "../../../../handler/http/httpHandler.ts"
import { Routing } from "../routing.ts"
import { UnitPath } from "../../path/unit/unitPath.ts"
import { Response } from "../../../../response/response.ts"
import { Abort } from "../../../../error/abort.ts"
import { LRequest } from "../../../../request/entity/lRequest.ts"
import { WebSocketOnUpgrade } from "../../../../handler/socket/webSocketOnUpgrade.ts"
import { Protocol } from "../../../../protocol/protocol.ts"

export class RoutingCollection implements IRoutingCollection {

    public constructor(
        private readonly routes: readonly Routing[] = []
    ) {}

    public readonly setHttpHandler = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): RoutingCollection => {
        const nextPath = paths.isCurrent ? UnitPath.root : paths.nextPath
        if (this.has(nextPath)) this.setHttp(method, paths, middlewares, handler)
        return this.routeAdded(nextPath).setHttp(method, paths, middlewares, handler)
    }

    public readonly setWebSocketHandler = (paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): RoutingCollection => {
        const nextPath = paths.isCurrent ? UnitPath.root : paths.nextPath
        if (this.has(nextPath)) this.setWebSocket(paths, middlewares, onUpgrade)
        return this.routeAdded(nextPath).setWebSocket(paths, middlewares, onUpgrade)
    }

    public readonly handle = async (protocol: Protocol, method: HTTPMethod, paths: Paths, req: LRequest, routedPaths: Paths): Promise<Response> => {
        const guardedPaths = paths.isCurrent ? new Paths([UnitPath.root]) : paths
        return await this.httpHandle(protocol, method, guardedPaths, req, routedPaths)
    }

    private readonly httpHandle = async (protocol: Protocol, method: HTTPMethod, paths: Paths, req: LRequest, routedPaths: Paths): Promise<Response> => {
        const tryRoutes: (Routing | undefined)[] = [this.matchRoute(paths.nextPath), this.anythingRoute(), this.catcallRoute()]
        for (const route of tryRoutes) {
            try {
                if (route === undefined) continue
                return await route.handle(protocol, method, paths.nextPaths, req, routedPaths)
            } catch (e) {
                if (e.type === 'abort' && e.statusCode === 404) continue
                throw e
            }
        }
        throw Abort.notFound
    }

    private readonly has = (path: UnitPath): boolean => {
        return this.routes.some(routing => routing.isPath(path))
    }

    private readonly matchRoute = (path: UnitPath): Routing | undefined => {
        console.log('match routes', path.value)
        return this.routes.find(route => route.isPath(path))
    }

    private readonly anythingRoute = (): Routing | undefined => {
        return this.routes.find(route => route.isAnything)
    }

    private readonly catcallRoute = (): Routing | undefined => {
        return this.routes.find(route => route.isCatcall)
    }

    private readonly routeAdded = (path: UnitPath): RoutingCollection => {
        const additionalRouting = Routing.init({ path: path })
        return new RoutingCollection(this.routes.concat([additionalRouting]))
    }

    private readonly setHttp = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): RoutingCollection => {
        const guardedPaths = paths.isCurrent ? new Paths([UnitPath.root]) : paths
        return new RoutingCollection(
            this.routes.map(
                routing => routing.isPath(guardedPaths.nextPath) ?
                    routing.setHttpHandler(method, guardedPaths.nextPaths, middlewares, handler) : routing
            )
        )
    }

    private readonly setWebSocket = (paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): RoutingCollection => {
        const guardedPaths = paths.isCurrent ? new Paths([UnitPath.root]) : paths
        return new RoutingCollection(
            this.routes.map(
                routing => routing.isPath(guardedPaths.nextPath) ?
                    routing.setWebSocketHandler(guardedPaths.nextPaths, middlewares, onUpgrade) : routing
            )
        )
    }

}