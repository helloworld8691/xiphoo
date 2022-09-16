
export interface ISO14443OperatorInterface {
    transceive(bytes: number[]) : Promise<number[]>;
    readBlocks(pageIndex: number) : Promise<number[]>;
    writeBlock(pageIndex: number, bytes: [number, number, number, number]) : Promise<number[]>;
}