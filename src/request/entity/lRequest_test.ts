import { assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { LRequest } from "./lRequest.ts"
import { LApplication } from "../../application/lApplication.ts"
import { HTTPHeaders } from "../../header/httpHeaders.ts"
import { HTTPMethod } from "../../method/httpMethod.ts"
import { URI } from "../../uri/uri.ts"
import { Paths } from "../../route/entity/path/collection/paths.ts"

Deno.test('paramsの取得', () => {
    const req = new LRequest(
        new LApplication(),
        new HTTPHeaders(),
        HTTPMethod.GET,
        new URI(Paths.make(['hello', 'world']))
    )

    req._routedPaths = Paths.make(['hello', ':name'])

    assertStrictEquals(req.parameters.get('name'), 'world')
})