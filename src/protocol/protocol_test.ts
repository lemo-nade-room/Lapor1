import { assert } from "https://deno.land/std@0.79.0/_util/assert.ts"
import { Protocol } from "./protocol.ts"

Deno.test('Protocolのテスト', () => {
    assert(new Protocol('http:').isHTTP())
    assert(new Protocol('https:').isHTTP())
    assert(!new Protocol('http:').isWebsocket())
    assert(!new Protocol('https:').isWebsocket())
    assert(!new Protocol('ws:').isHTTP())
    assert(!new Protocol('wss:').isHTTP())
    assert(new Protocol('ws:').isWebsocket())
    assert(new Protocol('wss:').isWebsocket())
})