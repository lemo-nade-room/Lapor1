import { assert, assertStrictEquals, assertThrows } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { UnitPath } from "./unitPath.ts"
import { InvalidPathPhraseError } from "../../../../error/invalidPathPhraseError.ts"
import { FrameworkError } from "../../../../error/frameworkError.ts"

Deno.test("等価性", () => {
    const path1 = UnitPath.make("hello")
    const path2 = UnitPath.make("morning")
    const path3 = UnitPath.make("hello")

    assert(!path1.equals(path2))
    assert(path1.equals(path3))
})

Deno.test("読み取りエラー", () => {
    assertThrows(() => UnitPath.make(""), InvalidPathPhraseError)
    assertThrows(() => UnitPath.make("hello/morning"), InvalidPathPhraseError)
    assertThrows(() => UnitPath.make("?hello=morning"), InvalidPathPhraseError)
})

Deno.test('**が最後以外に来るか', () => {
    assert(!UnitPath.anything.isCatcall)
    assert(UnitPath.catcall.isCatcall)
    assert(!UnitPath.make('a').isCatcall)
})

Deno.test('isAnythingの確認', () => {
    assert(UnitPath.make("*").isAnything)
    assert(UnitPath.make(":message").isAnything)
    assert(!UnitPath.make("a").isAnything)
})

Deno.test('param', () => {
    const notParam = UnitPath.make('hello')
    const paramPath = UnitPath.make(':hello')

    assert(!notParam.isParam())
    assert(paramPath.isParam())

    assertThrows(() => notParam.paramName(), FrameworkError)
    assertStrictEquals(paramPath.paramName(), 'hello')

    assertStrictEquals(notParam.value, 'hello')
    assertThrows(() => paramPath.value, FrameworkError)
})