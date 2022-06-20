import { Request } from "../../request/request.ts"
import { WebSocket } from "../../websocket/webSocket.ts"

export type WebSocketOnUpgrade = (req: Request, ws: WebSocket) => Promise<void>