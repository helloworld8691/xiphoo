import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';

export enum TechType {
    UNKNOWN,
    ISO14443,
    ISO15693,
  }

export abstract class Tag{

    public uid : string;
    public manufacturer : number = 0x0
    public type : number = 0x0
    public supportsPasswordProtection : Boolean = true

    constructor(tag: TagEvent | null) {
        this.uid = Tag.extractUID(tag)
        console.log("NFC", "UID: ", this.uid)
    }

    abstract name() : string 

    abstract techType() : TechType

    async setPasswordForWriting(password: [number, number, number, number]) {
        return false
    }

    async formatAndWriteNdefRecords(bytes: number[]) {
    }

    async writeUserDataRaw(pageOffset: number, bytes: number[]){
    }

    async initialize() {
        return true
    }

    formatHeaderOffset() : number {
        return 0
    }

    async authenticateForWriting(password: [number, number, number, number]) {
        return false
    }

    static manufacturerName(index: number) : string {
        switch(index) { 
            case 0x01: return "Motorola" 
            case 0x02: return "ST Microelectronics" 
            case 0x03: return "Hitachi, Ltd" 
            case 0x04: return "NXP Semiconductors" 
            case 0x07: return "Texas Instrument" 
            default: { 
               return "Unknown"
            } 
         } 
    }

    static extractUID(tag: TagEvent | null) : string {
        if (tag == null || tag.id == null) {
            return ""
        } else {
            if (typeof tag!.id === "string") {
                return tag!.id as string
            } else {
                // There is a bug in NFC react native library: id declared as number[]
                // Is in reality returned as 'string'. so to handle it properly in both cases
                // all this code is needed. I have created an issue:
                // https://github.com/revtel/react-native-nfc-manager/issues/476
                if (Array.isArray(tag!.id)) {
                    try {
                        return Tag.toHexString(tag!.id)       
                    } catch {}
                }
            }
        }
        return ""
    }

    UInt8(value: number) : number {
        return value & 0x0FF
    }

    static toHexArray(bytes: number[]) : string{
        return "HEX: [" + bytes.reduce((output, elem) => 
            (output + " " + ('0' + elem.toString(16)).slice(-2)) +",",
        '').toUpperCase().slice(0, -1)/* clean trailing comma*/ + " ]";
      }

    static toHexString(bytes: number[]) : string{
        return bytes.reduce((output, elem) => 
            (output + ('0' + elem.toString(16)).slice(-2)),
        '').toUpperCase();
      }
}