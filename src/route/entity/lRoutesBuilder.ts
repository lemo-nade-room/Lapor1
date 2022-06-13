import { RoutesBuilder } from "../routesBuilder.ts"
import { HttpHandler } from "../../handler/http/httpHandler.ts"
import { Middleware } from "../../middleware/middleware.ts"
import { HTTPMethod } from "../../method/httpMethod.ts"
import { Paths } from "./path/collection/paths.ts"
import { RouteCollection } from "../routeCollection.ts"
import { LRouting } from "./lRouting.ts"
import { LMiddlewares } from "../../middleware/entity/middlewares/lMiddlewares.ts"
import { WebSocketOnUpgrade } from "../../handler/webSocketOnUpgrade.ts"
import { Response } from "../../response/response.ts"
import { LRequest } from "../../request/entity/lRequest.ts"

export type GroupedOverload = {
    (use: Middleware): RoutesBuilder
    (path: string): RoutesBuilder
}

export type GroupOverload = {
    (use: Middleware, configure: (route: RoutesBuilder) => void): void
    (path: string, configure: (route: RoutesBuilder) => void): void
}

export type HttpHandleOverload = {
    (paths: string[], handler: HttpHandler): void
    (path: string, handler: HttpHandler): void
    (handler: HttpHandler): void
}

export class LRoutesBuilder implements RoutesBuilder {

    private constructor(
        private readonly routing: LRouting,
        private readonly base: Paths,
        private readonly middlewares: LMiddlewares,
    ) {}

    public static readonly init = () => new LRoutesBuilder(LRouting.init(), Paths.root, new LMiddlewares())

    public readonly get: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.httpRoute(HTTPMethod.GET, pathOrPathsOrHandler, handler)
    }

    public readonly post: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.httpRoute(HTTPMethod.POST, pathOrPathsOrHandler, handler)
    }

    public readonly put: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.httpRoute(HTTPMethod.PUT, pathOrPathsOrHandler, handler)
    }

    public readonly patch: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.httpRoute(HTTPMethod.PATCH, pathOrPathsOrHandler, handler)
    }

    public readonly delete: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.httpRoute(HTTPMethod.DELETE, pathOrPathsOrHandler, handler)
    }

    public readonly webSocket = (paths: string[], onUpgrade: WebSocketOnUpgrade): void => {}

    public readonly handle = async (method: HTTPMethod, paths: Paths, req: LRequest): Promise<Response> => {
        return await this.routing.handle(method, paths, req)
    }

    public readonly httpRoute = (method: HTTPMethod, pathOrPathsOrHandler: (string | string[] | HttpHandler), handler?: HttpHandler): void => {
        this.routing.setHttpHandler(
            method,
            this.httpRoutePaths(pathOrPathsOrHandler, handler),
            this.middlewares,
            handler ?? pathOrPathsOrHandler as HttpHandler
        )
    }

    public readonly grouped: GroupedOverload = set => {
        return typeof set === 'string' ? this.pathGrouped(set) : this.middlewareGrouped(set)
    }

    public readonly group: GroupOverload = (set, configure) => {
        /* const route = this.grouped(set)の場合、
           group(Middleware)にもgroup(string)にも合わないのでエラーになる
           引数のsetが Middleware | string であるため
         */
        const route = typeof set === 'string' ? this.grouped(set) : this.grouped(set)
        configure(route)
    }

    register(collection: RouteCollection): void {
        collection.boot(this)
    }

    private readonly httpRoutePaths = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler): Paths => {
        if (typeof pathOrPathsOrHandler === 'string' && handler) {
            return this.basedPaths([pathOrPathsOrHandler])
        }
        if (Array.isArray(pathOrPathsOrHandler) && handler) {
            return this.basedPaths(pathOrPathsOrHandler)
        }
        return this.basedPaths([])
    }

    private readonly basedPaths = (paths: string[]): Paths => {
        return Paths.make(paths)
            .based(this.base)
    }

    private readonly pathGrouped = (path: string): RoutesBuilder => {
        return new LRoutesBuilder(
            this.routing,
            Paths.make([path]).based(this.base),
            this.middlewares
        )
    }

    private readonly middlewareGrouped = (use: Middleware): RoutesBuilder => {
        return new LRoutesBuilder(
            this.routing,
            this.base,
            this.middlewares.used(use)
        )
    }
}