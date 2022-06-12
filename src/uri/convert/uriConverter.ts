import { URI } from "../uri.ts"
import { Paths } from "../../route/entity/path/collection/paths.ts"

export class UriConverter {
    public readonly convert = (pathname: string): URI => {
        return new URI(this.analyzePaths(pathname))
    }

    private readonly analyzePaths = (pathname: string): Paths => {
        if (pathname === '/') return Paths.make([])
        const separated = pathname.split('/')
        return Paths.make(separated.slice(1))
    }
}