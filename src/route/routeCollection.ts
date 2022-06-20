import { RoutesBuilder } from "./routesBuilder.ts"

export interface RouteCollection {
    boot(routes: RoutesBuilder): void
}
