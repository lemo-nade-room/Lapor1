import { WebSocket as IWebSocket } from "./webSocket.ts"

export class LWebSocket implements IWebSocket {

    public constructor(
        private readonly socket: WebSocket
    ) {}

    public get isClosed(): boolean {
        return this.socket.readyState !== 1
    }

    public readonly id = crypto.randomUUID()

    public readonly close = () => this.socket.close()

    public readonly onClose = (callback: () => Promise<void>): void => {
        this.socket.onclose = callback
    }

    public readonly onText = (callback: (ws: LWebSocket, text: string) => Promise<void>): void => {
        this.socket.onmessage = e => callback(this, e.data)
    }

    public readonly send = (text: string): void => {
        if (this.isClosed) return
        this.socket.send(text)
    }

}