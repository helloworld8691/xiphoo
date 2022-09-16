import { Tag, TechType } from "./Tag";
import { NDEF } from "./protocols/NDEF";
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { ISO15693 } from "./protocols/ISO15693";
import { ISO15693OperatorInterface } from "./operators/ISO15693OperatorInterface";

export class ISO15693Tag extends Tag {

    protected operator: ISO15693OperatorInterface

    constructor(tag: TagEvent | null, operator: ISO15693OperatorInterface) {
        super(tag)
        this.operator = operator
        if (this.uid.length > 14) {
            this.uid = this.uid.slice(0, 14)
        }
        // NOTE that UID format is reversed for Type V tag comparing to 
        // LSB -> MSB  MSB = Manufacturer ID, MSB - 1 = Type ID
        this.manufacturer = Number("0x" + this.uid[12] + this.uid[13])
        this.type = Number("0x" + this.uid[10] + this.uid[11])
        console.log("NFC", "Manufacturer: ", this.manufacturer)
        console.log("NFC", "Type: ", this.type)
        console.log("NFC", "UID: ", this.uid)
    }

    name(): string {
        return "Generic ISO 15693"
    }

    techType(): TechType {
        return TechType.ISO15693
    }
 
    async formatAndWriteNdefRecords(bytes: number[]) {
           
        const TLV_HEADER = [NDEF.TLV_NDEF_ID, bytes.length];
        const ENDBYTE = NDEF.TLV_TERMINATOR;
        
        let tstArea = [...TLV_HEADER, ...bytes, ENDBYTE];
        const CC_HEADER = [ISO15693.CC_MAGIC_BYTE, ISO15693.CC_VERSION, Math.ceil(tstArea.length / 8), 0x0 /* Feature Flag */]; 
        let message = [...CC_HEADER, ...tstArea];
   
        await this.writeUserDataRaw(0, message)
    }

    async writeUserDataRaw(pageOffset: number, bytes: number[]) {
           
        const PAGE_START = pageOffset;
        const PAGE_SIZE = 4;
        for (let index = 0; index < Math.ceil(bytes.length / PAGE_SIZE); index++) {
          let payload: [number, number, number, number] = [0, 0, 0, 0] 
          let pageIndex = index * PAGE_SIZE
          payload[0] = bytes[pageIndex + 0] ? bytes[pageIndex + 0] : 0
          payload[1] = bytes[pageIndex + 1] ? bytes[pageIndex + 1] : 0
          payload[2] = bytes[pageIndex + 2] ? bytes[pageIndex + 2] : 0
          payload[3] = bytes[pageIndex + 3] ? bytes[pageIndex + 3] : 0
          let response = await this.operator.writeBlock(
              PAGE_START + index, 
              payload);
            // TODO: add error detection
            console.log("NFC Response: ", Tag.toHexArray(response))   
        }
    }

    formatHeaderOffset() : number {
        // In ISO 4443, first record starts with TLV NDEF ID  
        // In ISO 15693, there is a 4-byte (1 record) TLV header, this is why this formatHeaderOffset property exists (see formatAndWriteNdefRecords)
        // By tag scan, the app tries to calculare physical begin offset of cipher record so it needs to consider this TLV header offset 
        return 1
      }

    static isError(response: number[]) : Boolean {
        if (response.length > 0){
            if (response[0] & ISO15693.FLAG_ERROR) {
                if (response.length > 1){
                    console.log("NFC", "ERROR: ", Tag.toHexArray([response[1]]))
                } else {
                    console.log("NFC", "ERROR ")
                }
                return true
            } else{
                return false
            }
        } else {
            return true
        }  
    }

    uidAs64BitNumber() : [number, number, number, number, number, number, number, number] {
        let response: [number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0]
        let convertedUID = this.parseHexString(this.uid + "E0")
        let length = convertedUID.length > 8 ? 8 : convertedUID.length
        for (let i = 0; i < length; i++) {
            response[i] = convertedUID[i]
        }
        return response
    }

    private parseHexString(str: string) : number[] { 
        var result = [];
        while (str.length >= 2) { 
            result.push(parseInt(str.substring(0, 2), 16));
            str = str.substring(2, str.length);
        }
        return result;
    }
 
}