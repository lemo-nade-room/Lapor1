import { assertEquals, assertStrictEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts"
import { SessionStorage } from "./sessionStorage.ts"
import { Sessions } from "../sessions.ts"

Deno.test('createSession', () => {
    const storage = new SessionStorage()
    const uuid = storage.create()
    let sessions: Sessions = storage.get(uuid)!

    sessions.data['hello'] = 'world'

    sessions = storage.get(uuid)!
    assertEquals(
        sessions.data['hello'],
        'world'
    )
})

Deno.test('get', () => {
    const storage = new SessionStorage()
    let sessions = storage.get(null)
    sessions.data['hello'] = 'world'
    const nullKey = sessions.uuid

    sessions = storage.get('hello')
    sessions.data['hello'] = 'こんにちは'
    const noKey = sessions.uuid

    assertStrictEquals(storage.get(nullKey).data['hello'], 'world')
    assertStrictEquals(storage.get(noKey).data['hello'], 'こんにちは')
})