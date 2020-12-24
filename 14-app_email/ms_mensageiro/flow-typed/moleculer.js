declare module 'moleculer' {

    declare type Params = {|
        nodeID: string;
        transporter: string
    |}

    declare export class ServiceBroker {
        constructor(Params): ServiceBroker;

        call(string, {}): Promise<object>;
        start(): Promise<void>;
        createService({name: string, actions: object, events: object}): void;
        stop(): void
    }

}