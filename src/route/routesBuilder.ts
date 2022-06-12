import { RouteCollection } from "./routeCollection.ts"
import { Middleware } from "../middleware/middleware.ts"
import { HttpHandler } from "../handler/http/httpHandler.ts"

export interface RoutesBuilder {

    get(paths: string[], handler: HttpHandler): void
    get(path: string, handler: HttpHandler): void

    post(paths: string[], handler: HttpHandler): void
    post(path: string, handler: HttpHandler): void

    put(paths: string[], handler: HttpHandler): void
    put(path: string, handler: HttpHandler): void

    patch(paths: string[], handler: HttpHandler): void
    patch(path: string, handler: HttpHandler): void

    delete(paths: string[], handler: HttpHandler): void
    delete(path: string, handler: HttpHandler): void

    register(collection: RouteCollection): void

    grouped(use: Middleware): RoutesBuilder
    grouped(path: string): RoutesBuilder

    group(use: Middleware, configure: (route: RoutesBuilder) => void): void
    group(path: string, configure: (route: RoutesBuilder) => void): void
}