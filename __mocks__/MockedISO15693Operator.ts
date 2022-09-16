import { ISO15693OperatorInterface } from "../src/tags/operators/ISO15693OperatorInterface";
import { ISO15693 } from "../src/tags/protocols/ISO15693";

export class MockedISO15693Operator implements ISO15693OperatorInterface {
    select(uid: number[]): Promise<Boolean> {
        const p : Promise<Boolean> = new Promise((resolve) => {
            resolve(true);
        });
        return p
    }
    
    writeBlock(pageIndex: number, bytes: [number, number, number, number]): Promise<number[]> {
        return this.transceive([
            ISO15693.FLAG_DATA_RATE_HIGH, 
            ISO15693.CMD_WRITE_SINGLE_BLOCK,
            pageIndex,
        ...bytes])
    }

    public customCommands: number[] = []

    invokeCustomCommand(status: number, cmd: number, manufacturerCode: number, data: number[]): Promise<number[]> {
        this.customCommands = this.customCommands.concat([status, cmd, manufacturerCode, ...data])
        const response = [0x00]
        const p : Promise<number[]> = new Promise((resolve) => {
            resolve(response);
        });
        return p
    }

    public transceived: number[] = []

    transceive(bytes: number[]): Promise<number[]> {
        this.transceived = this.transceived.concat(bytes)
        const response = [0x00]
        const p : Promise<number[]> = new Promise((resolve) => {
            resolve(response);
        });
        return p
    }

} 