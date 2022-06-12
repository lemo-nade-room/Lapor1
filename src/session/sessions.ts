import { SessionMiddleware } from "./middleware/sessionMiddleware.ts"

export interface Sessions {
    get middleware(): SessionMiddleware
}