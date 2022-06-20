import { HttpStatus } from "../status/httpStatus.ts"

export class Abort extends Error {

    private readonly type: string = 'abort'

    private constructor(
        public readonly httpStatus: HttpStatus,
    ) {
        super()
    }

    public static readonly badRequest = new Abort(HttpStatus.badRequest)
    public static readonly unauthorized = new Abort(HttpStatus.unauthorized)
    public static readonly forbidden = new Abort(HttpStatus.forbidden)
    public static readonly notFound = new Abort(HttpStatus.notFound)

    public get response(): Response {
        return this.httpStatus.response()
    }

    public get statusCode(): number {
        return this.httpStatus.statusCode
    }
}