import { HttpHandler } from "../handler/http/httpHandler.ts"
import { Middlewares } from "../middleware/middlewares.ts"
import { RouteCollection } from "../route/routeCollection.ts"
import { WebSocketOnUpgrade } from "../handler/webSocketOnUpgrade.ts"
import { GroupedOverload, GroupOverload } from "../route/entity/lRoutesBuilder.ts"
import { Directory } from "../directory/directory.ts"

export interface Application {

    get(paths: string[], handler: HttpHandler): void
    get(path: string, handler: HttpHandler): void
    get(handler: HttpHandler): void

    post(paths: string[], handler: HttpHandler): void
    post(path: string, handler: HttpHandler): void
    post(handler: HttpHandler): void

    put(paths: string[], handler: HttpHandler): void
    put(path: string, handler: HttpHandler): void
    put(handler: HttpHandler): void

    patch(paths: string[], handler: HttpHandler): void
    patch(path: string, handler: HttpHandler): void
    patch(handler: HttpHandler): void

    delete(paths: string[], handler: HttpHandler): void
    delete(path: string, handler: HttpHandler): void
    delete(handler: HttpHandler): void

    register(collection: RouteCollection): void

    webSocket(paths: string[], onUpgrade: WebSocketOnUpgrade): void

    grouped: GroupedOverload

    group: GroupOverload

    get middleware(): Middlewares

    register(collection: RouteCollection): void

    directory: Directory

}