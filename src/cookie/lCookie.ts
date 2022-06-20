export class LCookie {

    public constructor(
        private readonly cookie: string
    ) {}

    public get sessionId(): string | null {
        return this.middleSessionId ?? this.endSessionId
    }

    private get sessionKey(): string {
        return 'session_id='
    }

    private get middleSessionId(): string | null {
        const array = this.cookie.match(/session_id=(.*?);/)
        return array ? array[1] : null
    }

    private get endSessionId(): string | null {
        const index = this.cookie.indexOf(this.sessionKey)
        if (index === -1) return null
        return this.cookie.substring(index + this.sessionKey.length, this.cookie.length)
    }
}