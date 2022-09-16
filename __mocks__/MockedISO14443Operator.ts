import { ISO14443OperatorInterface } from "../src/tags/operators/ISO14443OperatorInterface";
import { ISO14443 } from "../src/tags/protocols/ISO14443";

export class MockedISO14443Operator implements ISO14443OperatorInterface {

    readBlocks(pageIndex: number): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

    writeBlock(pageIndex: number, bytes: [number, number, number, number]): Promise<number[]> {
        return this.transceive([ISO14443.CMD_WRITE, pageIndex, ...bytes])
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