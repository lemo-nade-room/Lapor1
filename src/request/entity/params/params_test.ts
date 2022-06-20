import { assertStrictEquals, assertThrows } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { Params } from "./params.ts"
import { UnsetParamsGetError } from "../../../error/unsetParamsGetError.ts"

Deno.test('paramsのテスト', () => {
    const params = new Params()
        .appended('name', 'tanaka')
        .appended('hello', 'world')

    assertStrictEquals(params.get('name'),  'tanaka')
    assertStrictEquals(params.get('hello'),  'world')

    assertThrows(() => params.get('world'), UnsetParamsGetError)
})