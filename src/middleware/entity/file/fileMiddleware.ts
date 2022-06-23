import { Middleware } from "../../middleware.ts"
import { HttpHandler } from "../../../handler/http/httpHandler.ts"
import { Request } from "../../../request/request.ts"
import * as L from 'https://github.com/lemo-nade-room/Lapor/raw/main/lapor.ts'
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { Abort } from "../../../error/abort.ts"


export class FileMiddleware implements Middleware {

    public constructor(
        private readonly baseDirectory: string
    ) {
    }

    public readonly respond = async (req: Request, _next: HttpHandler): Promise<L.Response> => {
        const response = await this.serveDirResponse(req)
        if (response.status === 404) return { type: 'responsible', response: () => this.indexFile() }
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

    private readonly indexFile = async () => {
        const file = await Deno.readTextFile(this.baseDirectory + 'index.html')
        if (!file) throw Abort.notFound
        return new Response(file, { headers: {"Content-Type": "text/html; charset=utf-8"}})
    }

    private readonly serveDirResponse = (req: Request) => {
        return serveDir(req.denoRequest, {
            fsRoot: this.baseDirectory,
            urlRoot: "",
            showDirListing: true,
            enableCors: true,
        });
    }
}