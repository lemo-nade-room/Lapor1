import { UnitPath } from "../path/unit/unitPath.ts"
import { WebSocketOnUpgrade } from "../../../handler/webSocketOnUpgrade.ts"
import { IRoutingCollection } from "./collection/iRoutingCollection.ts"
import { HttpHandlers } from "../../../handler/http/each/httpHandlers.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { HTTPMethod } from "../../../method/httpMethod.ts"
import { Paths } from "../path/collection/paths.ts"
import { LMiddlewares } from "../../../middleware/entity/middlewares/lMiddlewares.ts"
import { Response } from "../../../response/response.ts"
import { RoutingCollection } from "./collection/routingCollection.ts"
import { LRequest } from "../../../request/entity/lRequest.ts"

export class Routing {

    private constructor(
        private readonly path: UnitPath,
        private readonly handlers: HttpHandlers,
        private readonly routingCollection: IRoutingCollection,
        private readonly socketHandler?: WebSocketOnUpgrade,
    ) {}

    public static readonly init = (data: {
        path?: UnitPath,
        handlers?: HttpHandlers,
        routingCollection?: IRoutingCollection,
        socketHandler?: WebSocketOnUpgrade
    }): Routing => {
        return new Routing(
            data.path ?? UnitPath.root,
            data.handlers ?? new HttpHandlers(),
            data.routingCollection ?? new RoutingCollection(),
            data.socketHandler
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

    public readonly handle = async (method: HTTPMethod, paths: Paths, req: LRequest, routedPaths: Paths): Promise<Response> => {
        if (!paths.isCurrent) return await this.routingCollection.handle(method, paths, req, this.nextRoutedPaths(routedPaths))
        req._routedPaths = this.nextRoutedPaths(routedPaths)
        return await this.handlers.handle(method, req)
    }

    private readonly nextRoutedPaths = (paths: Paths): Paths => {
        return this.path.isRoot ? paths : paths.goThrough(this.path)
    }

    private readonly setCurrentHttpHandler = (method: HTTPMethod, middlewares: LMiddlewares, handler: HttpHandler): Routing => {
        return this.clone({ handlers: this.handlers.setHandler(method, middlewares, handler) })
    }

    private readonly setHttpHandlerNextRoutingCollection = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): Routing => {
        return this.clone({ routingCollection: this.routingCollection.setHttpHandler(method, paths, middlewares, handler) })
    }

    private readonly clone = (data: {
        path?: UnitPath,
        handlers?: HttpHandlers,
        routingCollection?: IRoutingCollection,
        socketHandler?: WebSocketOnUpgrade
    }): Routing => {
        return new Routing(
            data.path ?? this.path,
            data.handlers ?? this.handlers,
            data.routingCollection ?? this.routingCollection,
            data.socketHandler ?? this.socketHandler
        )
    }
}