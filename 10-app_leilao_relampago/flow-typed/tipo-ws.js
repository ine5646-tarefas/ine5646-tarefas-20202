declare module "ws" {

    declare class WebSocket {
        static Server({noServer: true}): WebSocketServer;
        static OPEN: number;
        readyState: number;
        send: string => void;

        on('message', string => void): void;
        on('close', () => void): void
    }

    declare class WebSocketServer extends events$EventEmitter {
        clients: Set<WebSocket>;

        handleUpgrade(req: http$IncomingMessage, socket: net$Socket, head: Buffer, callback: (WebSocket) => mixed): void
    }


    declare export default typeof WebSocket
}
