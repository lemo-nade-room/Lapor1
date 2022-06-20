import { LCookie } from "./lCookie.ts"
import { assertEquals } from "https://deno.land/x/websocket@v0.1.4/deps.ts"

Deno.test('クッキーの取り出し（一つのみ）', () => {
    const cookie = new LCookie('session_id=helloworld')
    const uuid = cookie.sessionId

    assertEquals(uuid, 'helloworld')
})


Deno.test('クッキーの取り出し、複数値', () => {
    const cookie = new LCookie('session_id=helloworld; token=hello')
    const uuid = cookie.sessionId

    assertEquals(uuid, 'helloworld')
})

Deno.test('クッキーの取り出し、複数値の最後', () => {
    const cookie = new LCookie('token=hello; session_id=helloworld')
    const uuid = cookie.sessionId

    assertEquals(uuid, 'helloworld')
})