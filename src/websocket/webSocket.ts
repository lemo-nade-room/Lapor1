export interface WebSocket {
    id: string
    send(text: string): void
    onText(callback: ((ws: WebSocket, text: string) => Promise<void>)): void
    close(): void
    onClose(callback: () => Promise<void>): void
}