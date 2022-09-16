
export interface ISO15693OperatorInterface {

    select(uid: number[]) : Promise<Boolean>;
    writeBlock(pageIndex: number, bytes: [number, number, number, number]) : Promise<number[]>;
    invokeCustomCommand(status: number, cmd: number, manufacturerCode: number, data: number[]) : Promise<number[]>;
}