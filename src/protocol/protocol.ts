export class Protocol {

    public constructor(
        private readonly protocol: string
    ) {}

    public readonly isHTTP = (): boolean => {
        if (this.protocol === 'http:') return true
        if (this.protocol === 'https:') return true
        return false
    }

    public readonly isWebsocket = (): boolean => {
        if (this.protocol === 'ws:') return true
        if (this.protocol === 'wss:') return true
        return false
    }
}