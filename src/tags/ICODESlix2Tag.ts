
import { ICODESlixTag } from "./ICODESlixTag";

// https://www.nxp.com/docs/en/data-sheet/SL2S2602.pdf

// NOTE That ICODE SLIX (without any additional indicies in name) also has type 0x01
// which might be a problem because authentication method used there is different 
// Possibly additional identification using memory size or similar will be needed 

export class ICODESlix2Tag extends ICODESlixTag {

    public static MANUFACTURER = 0x04
    public static TYPE = 0x01

    name(): string {
        return "ICODE Slix-2 (ISO 15693)"
    }

    userDataSizeInBlocks() : number {
        return 80
    }

}