import { WebSocket as IWebSocket } from "./webSocket.ts"

export class LWebSocket implements IWebSocket {

    public constructor(
        private readonly socket: WebSocket
    ) {}

    private isClosed = false

    public readonly id = crypto.randomUUID()

    public readonly close = () => this.socket.close()

    public readonly onClose = (callback: () => Promise<void>): void => {
        this.socket.onclose = async () => {
            await callback()
            this.isClosed = true
        }
    }

    public readonly onText = (callback: (ws: LWebSocket, text: string) => Promise<void>): void => {
        this.socket.onmessage = e => callback(this, e.data)
    }

    public readonly send = (text: string): void => {
        if (this.isClosed) return
        this.socket.send(text)
    }

}