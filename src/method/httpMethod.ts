import { UndefinedHttpMethodError } from "../error/undefinedHttpMethodError.ts";

export class HTTPMethod {

    public readonly symbol: symbol

    private constructor(
        private readonly name: string,
    ) {
        this.symbol = Symbol(this.name)
    }

    private static readonly METHODS: { [index: string]: HTTPMethod } = {
        "GET": new HTTPMethod("GET"),
        "POST": new HTTPMethod("POST"),
        "PUT": new HTTPMethod("PUT"),
        "PATCH": new HTTPMethod("PATCH"),
        "DELETE": new HTTPMethod("DELETE"),
    }

    public static readonly GET = this.METHODS["GET"]
    public static readonly POST = this.METHODS["POST"]
    public static readonly PUT = this.METHODS["PUT"]
    public static readonly PATCH = this.METHODS["PATCH"]
    public static readonly DELETE = this.METHODS["DELETE"]

    public static readonly read = (method: string): HTTPMethod => {
        const httpMethod = this.METHODS[method]
        if (httpMethod === undefined) throw new UndefinedHttpMethodError()
        return httpMethod
    }
}