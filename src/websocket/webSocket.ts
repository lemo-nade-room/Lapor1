export interface WebSocket {
    send(text: string): Promise<void>
    onText(callback: ((ws: WebSocket, text: string) => Promise<void>)): void
    close(): Promise<void>
    get onClose(): {
        whenComplete(callback: () => Promise<void>): void
    }
}