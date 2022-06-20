import { Middleware } from "./middleware.ts"

export interface Middlewares {
    use(middleware: Middleware): void
}