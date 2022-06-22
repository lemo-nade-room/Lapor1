export class LCookie {

    public constructor(
        private readonly cookie: string
    ) {}

    private get sessionKey(): string {
        return 'session_id='
    }

    public get sessionId(): string | null {
        const ids = this.cookie.split(';')
            .filter(cookie => cookie.includes(this.sessionKey))
            .map(cookie => cookie.substring(cookie.indexOf(this.sessionKey) + this.sessionKey.length, this.cookie.length))
        return ids.pop() ?? null
    }
}