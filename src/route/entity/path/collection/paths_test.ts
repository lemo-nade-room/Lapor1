import { assert, assertStrictEquals, assertThrows } from "https://deno.land/std@0.65.0/testing/asserts.ts";
import { Paths } from "./paths.ts"
import { UnitPath } from "../unit/unitPath.ts"
import { FrameworkError } from "../../../../error/frameworkError.ts"
import { InvalidPathPhraseError } from "../../../../error/invalidPathPhraseError.ts"

Deno.test("等価", () => {
    const paths1 = Paths.make([])
    const paths2 = Paths.make([])
    const paths3 = Paths.make(['hello', 'world'])
    const paths4 = Paths.make(['hello', 'world'])
    const paths5 = Paths.make(['world'])

    assert(paths1.equals(paths2))
    assert(!paths1.equals(paths3))
    assert(paths3.equals(paths4))
    assert(!paths5.equals(paths3))
    assert(!paths4.equals(paths5))
})

Deno.test("現在のルートであるか", () => {
    const currentPaths = Paths.make([])
    assert(currentPaths.isCurrent)

    const nextPaths = Paths.make(['hello'])
    assert(!nextPaths.isCurrent)
})

Deno.test('次の単一パス', () => {
    const nextPaths = Paths.make(['hello', 'world'])

    const actual = nextPaths.nextPath
    const expected = UnitPath.make('hello')
    assert(actual.equals(expected))
})

Deno.test('異常系: 存在しない次の単一パス', () => {
    const nextPaths = Paths.make([])

    assertThrows(() => nextPaths.nextPath, FrameworkError)
})

Deno.test('次以降のパス', () => {
    const paths = Paths.make(['hello', 'my', 'world'])

    const actual = paths.nextPaths
    const expected = Paths.make(['my', 'world'])
    assert(actual.equals(expected))
})

Deno.test('異常系: 存在しない次の次以降のパス', () => {
    const nextPaths = Paths.make([])

    assertThrows(() => nextPaths.nextPaths, FrameworkError)
})

Deno.test('baseのパスを指定', () => {
    const base = Paths.make(['base', 'path'])
    const paths = Paths.make(['hello', 'world'])

    const actual = paths.based(base)
    const expected = Paths.make(['base', 'path', 'hello', 'world'])
    assert(actual.equals(expected))
})

Deno.test('異常系: 最後以外にcatcall', () => {
    Paths.make(['*', 'a'])
    Paths.make(['b', '**'])
    assertThrows(() => Paths.make(['**', 'a']), InvalidPathPhraseError)
})

Deno.test('paramsの取り出し', () => {
    const uriPaths = Paths.make(['hello', 'tanaka', 'good'])
    const routedPaths = Paths.make(['hello', ':name', 'good'])

    const params = uriPaths.parameters(routedPaths)

    assertStrictEquals(params.get('name'), 'tanaka')
})

Deno.test('経由', () => {
    const before = Paths.root
    const after = before.goThrough(UnitPath.make('Hello'))

    assert(after.equals(Paths.make(['Hello'])))
})