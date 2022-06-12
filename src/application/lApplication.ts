import { Application } from "./application.ts"
import { GroupedOverload, GroupOverload, HttpHandleOverload, LRoutesBuilder } from "../route/entity/lRoutesBuilder.ts"
import { Middlewares } from "../middleware/middlewares.ts"
import { LMiddlewares } from "../middleware/entity/middlewares/lMiddlewares.ts"
import { RouteCollection } from "../route/routeCollection.ts"
import { Sessions } from "../session/sessions.ts"
import { WebSocketOnUpgrade } from "../handler/webSocketOnUpgrade.ts"
import { HTTPMethod } from "../method/httpMethod.ts"
import { HttpHandler } from "../handler/http/httpHandler.ts"
import { Paths } from "../route/entity/path/collection/paths.ts"
import { Request } from "../request/request.ts"
import { Response } from "../response/response.ts"
import { SessionMiddleware } from "../session/middleware/sessionMiddleware.ts"

export class LApplication implements Application {

    public constructor(
        private readonly routesBuilder: LRoutesBuilder = LRoutesBuilder.init(),
        private readonly middlewares: LMiddlewares = new LMiddlewares()
    ) {}

    public readonly get: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.routesBuilder.httpRoute(HTTPMethod.GET, pathOrPathsOrHandler, handler)
    }

    public readonly post: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.routesBuilder.httpRoute(HTTPMethod.POST, pathOrPathsOrHandler, handler)
    }

    public readonly put: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.routesBuilder.httpRoute(HTTPMethod.PUT, pathOrPathsOrHandler, handler)
    }

    public readonly patch: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.routesBuilder.httpRoute(HTTPMethod.PATCH, pathOrPathsOrHandler, handler)
    }

    public readonly delete: HttpHandleOverload = (pathOrPathsOrHandler: string | string[] | HttpHandler, handler?: HttpHandler) => {
        this.routesBuilder.httpRoute(HTTPMethod.DELETE, pathOrPathsOrHandler, handler)
    }

    public readonly group: GroupOverload = (set, configure) => {
        typeof set === 'string' ? this.routesBuilder.group(set, configure) : this.routesBuilder.group(set, configure)
    }

    public readonly grouped: GroupedOverload = set => {
        return typeof set === 'string' ? this.routesBuilder.grouped(set) : this.routesBuilder.grouped(set)
    }

    public get middleware(): Middlewares {
        return this.middlewares;
    }

    public readonly register = (collection: RouteCollection): void => {
        this.routesBuilder.register(collection)
    }

    public readonly handle = async (method: HTTPMethod, paths: Paths, req: Request): Promise<Response> => {
        return await this.routesBuilder.handle(method, paths, req)
    }

    // 未実装
    public get sessions(): Sessions {
        return new class implements Sessions {
            get middleware(): SessionMiddleware {
                return new SessionMiddleware;
            }
        }()
    }

    public readonly webSocket = (paths: string[], onUpgrade: WebSocketOnUpgrade): void => {
        return this.routesBuilder.webSocket(paths, onUpgrade)
    }

}