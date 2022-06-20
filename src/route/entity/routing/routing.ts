import { UnitPath } from "../path/unit/unitPath.ts"
import { WebSocketOnUpgrade } from "../../../handler/socket/webSocketOnUpgrade.ts"
import { IRoutingCollection } from "./collection/iRoutingCollection.ts"
import { HttpHandlers } from "../../../handler/http/each/httpHandlers.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { Paths } from "../path/collection/paths.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { Response } from "../../../response/response.ts"
import { RoutingCollection } from "./collection/routingCollection.ts"
import { LRequest } from "../../../request/entity/lRequest.ts"
import { WebSocketMethodHandler } from "../../../handler/socket/WebSocketMethodHandler.ts"
import { Protocol } from "../../../protocol/protocol.ts"
import { Abort } from "../../../../lapor.ts"

export class Routing {

    private constructor(
        private readonly path: UnitPath,
        private readonly handlers: HttpHandlers,
        private readonly routingCollection: IRoutingCollection,
        private readonly socketMethodHandler?: WebSocketMethodHandler,
    ) {}

    public static readonly init = (data: {
        path?: UnitPath,
        handlers?: HttpHandlers,
        routingCollection?: IRoutingCollection,
        socketMethodHandler?: WebSocketMethodHandler,
    }): Routing => {
        return new Routing(
            data.path ?? UnitPath.root,
            data.handlers ?? new HttpHandlers(),
            data.routingCollection ?? new RoutingCollection(),
            data.socketMethodHandler
        )
    }

    public readonly isPath = (path: UnitPath): boolean => this.path.equals(path)

    public get isAnything(): boolean {
        return this.path.isAnything
    }

    public get isCatcall(): boolean {
        return this.path.isCatcall
    }

    public readonly setHttpHandler = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): Routing => {
        if (paths.isCurrent) return this.setCurrentHttpHandler(method, middlewares, handler)
        return this.setHttpHandlerNextRoutingCollection(method, paths, middlewares, handler)
    }

    public readonly setWebSocketHandler = (paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): Routing => {
        if (paths.isCurrent) return this.setCurrentWebSocketHandler(middlewares, onUpgrade)
        return this.setWebSocketNextRoutingCollection(paths, middlewares, onUpgrade)
    }

    public readonly handle = async (protocol: Protocol, method: HTTPMethod, paths: Paths, req: LRequest, routedPaths: Paths): Promise<Response> => {
        if (this.isNextRouting(paths)) return await this.routingCollection.handle(protocol, method, paths, req, this.nextRoutedPaths(routedPaths))
        req._routedPaths = this.nextRoutedPaths(routedPaths)
        console.dir(routedPaths)
        if (protocol.isWebsocket()) return this.webSocketHandle(req)
        return await this.handlers.handle(method, req)
    }

    private readonly webSocketHandle = async (req: LRequest): Promise<Response> => {
        if (this.socketMethodHandler === undefined) throw Abort.notFound
        return await this.socketMethodHandler.handle(req)
    }

    private readonly isNextRouting = (paths: Paths): boolean => {
        if (this.path.isCatcall) return false
        if (paths.isCurrent) return false
        return true
    }

    private readonly nextRoutedPaths = (paths: Paths): Paths => {
        return this.path.isRoot ? paths : paths.goThrough(this.path)
    }

    private readonly setCurrentHttpHandler = (method: HTTPMethod, middlewares: LMiddlewares, handler: HttpHandler): Routing => {
        return this.clone({ handlers: this.handlers.setHandler(method, middlewares, handler) })
    }

    private readonly setCurrentWebSocketHandler = (middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): Routing => {
        return this.clone({ socketMethodHandler: new WebSocketMethodHandler(onUpgrade, middlewares) })
    }

    private readonly setHttpHandlerNextRoutingCollection = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): Routing => {
        return this.clone({ routingCollection: this.routingCollection.setHttpHandler(method, paths, middlewares, handler) })
    }

    private readonly setWebSocketNextRoutingCollection = (paths: Paths, middlewares: LMiddlewares, onUpgrade: WebSocketOnUpgrade): Routing => {
        return this.clone({ routingCollection: this.routingCollection.setWebSocketHandler(paths, middlewares, onUpgrade) })
    }

    private readonly clone = (data: {
        path?: UnitPath,
        handlers?: HttpHandlers,
        routingCollection?: IRoutingCollection,
        socketMethodHandler?: WebSocketMethodHandler,
    }): Routing => {
        return new Routing(
            data.path ?? this.path,
            data.handlers ?? this.handlers,
            data.routingCollection ?? this.routingCollection,
            data.socketMethodHandler ?? this.socketMethodHandler
        )
    }
}