import { Request } from "../request.ts"
import { LApplication } from "../../application/lApplication.ts"
import { HTTPHeaders } from "../../header/httpHeaders.ts"
import { HTTPMethod } from "../../method/httpMethod.ts"
import { URI } from "../../uri/uri.ts"
import { Application } from "../../application/application.ts"
import { Paths } from "../../route/entity/path/collection/paths.ts"
import { FrameworkError } from "../../error/frameworkError.ts"
import { Params } from "./params/params.ts"
import { Directory } from "../../directory/directory.ts"
import { LDirectory } from "../../directory/lDirectory.ts"

export class LRequest implements Request {

    public constructor(
        private readonly lApplication: LApplication,
        public readonly headers: HTTPHeaders,
        public readonly method: HTTPMethod,
        public readonly url: URI,
        public readonly directory: Directory = new LDirectory(),
        public _routedPaths?: Paths
    ) {}

    get application(): Application {
        return this.lApplication
    }

    get content(): Record<string | number, unknown> {
        return undefined as any;
    }

    get parameters(): Params {
        if (this._routedPaths === undefined) throw new FrameworkError('ルーティングパスが設定されていないのにparametersを呼び出した')
        return this.url.paths.parameters(this._routedPaths)
    }

    get query(): Record<string, string> {
        return undefined as any;
    }

}