declare module 'moleculer' {

    declare type Params = {|
        nodeID: string;
        transporter: string
    |}

    declare export class ServiceBroker {
        constructor(Params): ServiceBroker;

        call(string, {}): Promise<object>;
        createService({name: string, actions: object}): void;
        emit(string, object): void;
        start(): Promise<void>;
        stop(): void
    }

}