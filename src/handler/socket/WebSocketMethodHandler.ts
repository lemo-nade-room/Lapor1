import { WebSocketOnUpgrade } from "./webSocketOnUpgrade.ts"
import { LMiddlewares } from "../../middleware/entity/middlewares/lMiddlewares.ts"
import { Request } from "../../request/request.ts"
import { Response as LResponse } from "../../response/response.ts"
import { HttpHandler } from "../http/httpHandler.ts"
import { LWebSocket } from "../../websocket/lWebSocket.ts"


export class WebSocketMethodHandler {
    public constructor(
        private readonly onUpgrade: WebSocketOnUpgrade,
        private readonly middlewares: LMiddlewares
    ) {}

    public readonly handle = async (req: Request): Promise<LResponse> => {
        console.log('ws method handler handled')
        return await this.middlewares.handle(req, this.upgradeHandler)
    }

    private readonly upgradeHandler: HttpHandler = async req => {
        let response: Response
        let socket: WebSocket;
        try {
            ({ response, socket } = Deno.upgradeWebSocket(req.denoRequest));
            console.log(req.denoRequest)
        } catch {
            return "request isn't trying to upgrade to websocket."
        }
        const ws = new LWebSocket(socket)
        socket.onopen = () => this.onUpgrade(req, ws)
        return { type: 'responsible', response: () =>  response}
    }
}