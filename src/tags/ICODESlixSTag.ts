import { Tag } from "./Tag";
import { ICODESlixTag } from "./ICODESlixTag";

// https://www.nxp.com/docs/en/data-sheet/SL2S5302_SL2S5402.pdf

export class ICODESlixSTag extends ICODESlixTag {

    public static MANUFACTURER = 0x04
    public static TYPE = 0x02

    name(): string {
        return "ICODE Slix-S (ISO 15693)"
    }

    userDataSizeInBlocks() : number {
        return 64
    }

}