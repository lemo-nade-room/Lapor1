import { Middleware } from "../../middleware.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { Request } from "../../../request/request.ts"
import { Response } from "../../../response/response.ts"
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";


export class FileMiddleware implements Middleware {

    public constructor(
        private readonly baseDirectory: string
    ) {
    }

    public readonly respond = async (req: Request, _next: HttpHandler): Promise<Response> => {
        return {
            type: 'responsible',
            response: () => {
                return serveDir(req.denoRequest, {
                    fsRoot: this.baseDirectory,
                    urlRoot: "",
                    showDirListing: true,
                    enableCors: true,
                });
            }
        }
    }
}