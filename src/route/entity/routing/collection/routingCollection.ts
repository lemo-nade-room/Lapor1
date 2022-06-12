import { IRoutingCollection } from "./iRoutingCollection.ts"
import { HTTPMethod } from "../../../../method/httpMethod.ts"
import { Paths } from "../../path/collection/paths.ts"
import { LMiddlewares } from "../../../../middleware/entity/middlewares/lMiddlewares.ts"
import { HttpHandler } from "../../../../handler/http/httpHandler.ts"
import { Routing } from "../routing.ts"
import { UnitPath } from "../../path/unit/unitPath.ts"
import { HttpHandlers } from "../../../../handler/http/each/httpHandlers.ts"
import { Request } from "../../../../request/request.ts"
import { Response } from "../../../../response/response.ts"
import { Abort } from "../../../../error/abort.ts"

export class RoutingCollection implements IRoutingCollection {

    public constructor(
        private readonly routes: readonly Routing[] = []
    ) {}

    public readonly setHttpHandler = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): IRoutingCollection => {
        if (this.has(paths.nextPath)) this.setHttp(method, paths, middlewares, handler)
        return this.routeAdded(paths.nextPath).setHttp(method, paths, middlewares, handler)
    }

    public readonly handle = async (method: HTTPMethod, paths: Paths, req: Request): Promise<Response> => {
        const route = this.matchRoute(paths.nextPath)
        if (route) return await route.handle(method, paths.nextPaths, req)

        const anythingRoute = this.anythingRoute()
        if (anythingRoute) return await anythingRoute.handle(method, paths.nextPaths, req)

        throw Abort.notFound
    }

    private readonly has = (path: UnitPath): boolean => {
        return this.routes.some(routing => routing.isPath(path))
    }

    private readonly matchRoute = (path: UnitPath): Routing | undefined => {
        return this.routes.find(route => route.isPath(path))
    }

    private readonly anythingRoute = (): Routing | undefined => {
        return this.routes.find(route => route.isAnything)
    }

    private readonly routeAdded = (path: UnitPath): RoutingCollection => {
        const additionalRouting = new Routing(
            path,
            new HttpHandlers(),
            new RoutingCollection()
        )
        return new RoutingCollection(this.routes.concat([additionalRouting]))
    }

    private readonly setHttp = (method: HTTPMethod, paths: Paths, middlewares: LMiddlewares, handler: HttpHandler): RoutingCollection => {
        return new RoutingCollection(
            this.routes.map(
                routing => routing.isPath(paths.nextPath) ?
                    routing.setHttpHandler(method, paths.nextPaths, middlewares, handler) : routing
            )
        )
    }
}