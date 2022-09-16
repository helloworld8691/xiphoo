
import { Tag, TechType } from "./Tag";
import { NDEF } from "./protocols/NDEF";
import {TagEvent} from 'react-native-nfc-manager';
import { ISO14443 } from "./protocols/ISO14443";
import { ISO14443OperatorInterface } from "./operators/ISO14443OperatorInterface";

export class ISO14443Tag extends Tag {

   protected operator: ISO14443OperatorInterface

    constructor(tag: TagEvent | null, operator: ISO14443OperatorInterface) {
        super(tag)
        this.operator = operator
        // LSB -> MSB for this ISO manufactuer ID is at LSB
        this.manufacturer = Number("0x" + this.uid[0] + this.uid[1])
        console.log("NFC", "Manufacturer: ", this.manufacturer, Tag.manufacturerName(this.manufacturer))
    }

    name(): string {
        return "Generic ISO 14443"
    }

    techType(): TechType {
      return TechType.ISO14443
   }
    
    async formatAndWriteNdefRecords(bytes: number[]) {
        const HEADER = [NDEF.TLV_NDEF_ID, 
          0x89]; // TODO: this is actually payload length, this should be fixed
        const ENDBYTE = NDEF.TLV_TERMINATOR;
        const PAGE_START = ISO14443Tag.FIRST_DATA_PAGE;
      
        let message = [...HEADER, ...bytes, ENDBYTE];
      
        // TODO: replace with wirteUserDataRaw call 
        for (let index = 0; index < Math.ceil(message.length / 4); index++) {
          await this.operator.transceive([ISO14443.CMD_WRITE, PAGE_START + index, ...message.slice(index * 4, (index + 1) * 4).map((b) => (b ? b : 0))]);
        }
    }

    async writeUserDataRaw(pageOffset: number, bytes: number[]){
      const PAGE_START = ISO14443Tag.FIRST_DATA_PAGE + pageOffset;
      for (let index = 0; index < Math.ceil(bytes.length / 4); index++) {
        await this.operator.transceive([ISO14443.CMD_WRITE, PAGE_START + index, ...bytes.slice(index * 4, (index + 1) * 4).map((b) => (b ? b : 0))]);
      }
    }

    formatHeaderOffset() : number {
      // In ISO 4443, first record starts with TLV NDEF ID  
      // In ISO 15693, there is a 4-byte (1 record) TLV header, this is why this formatHeaderOffset property exists
      // By tag scan, the app tries to calculare physical begin offset of cipher record so it needs to consider this TLV header offset 
      return 0
    }

    async authenticateForWriting(password: [number, number, number, number]) {
        var resp = await this.operator.transceive([0x1B, ...password])
        return resp[0] == ISO14443.PACK[0] && resp[1] == ISO14443.PACK[1]
    }

    async setPasswordForWriting(password: [number, number, number, number]) {
        let cfgOffset = -1;

        let version = await this.operator.transceive([ ISO14443.CMD_GET_VERSION]);
      
        cfgOffset = this.getConfigOffset(version, cfgOffset);
      
        console.log("NFC: passResponse", version.map(b => b.toString(16).toUpperCase()).join(":"))
        console.log("NFC: setPassword ~ cfgOffset", cfgOffset.toString(16))
      
        if (cfgOffset == -1) return false;
        let packResponse = await this.operator.writeBlock(
          ((cfgOffset + 2) & 0x0FF),    // page address
          [password[0], password[1], password[2], password[3]  // new page data
        ]);
        packResponse = await this.operator.writeBlock(
          ((cfgOffset + 3) & 0x0FF),     // page address
          [ISO14443.PACK[0], ISO14443.PACK[1], 0x00, 0x00  // new page data (always need to write full page)
        ])
      
      
        let fromPageNum = 4, enableProtection = true, enableReadProtection = false;
      
        let response = await this.operator.readBlocks(
          (cfgOffset & 0x0FF)  // page address
        );
        if ((response != null) && (response.length >= 16)) {
          // success
          // NOTE that READ will return *4 pages* starting at page address
          let auth0 = 0xFF;
          if (enableProtection || enableReadProtection) {
            auth0 = (fromPageNum & 0x0FF);
          }
          let writeResponse = await this.operator.writeBlock(
            ((cfgOffset + 0) & 0x0FF),              // page address
            [response[0], response[1], response[2], auth0  // new page data
          ]);
      
          let access = (response[4] & 0x07F);
          if (enableProtection && enableReadProtection) {
            access |= 0x80;
          }
          writeResponse = await this.operator.writeBlock(
            ((cfgOffset + 1) & 0x0FF),                // page address
            [access, response[5], response[6], response[7],  // new page data
          ]);
        }
        else return false;
        return true;
    }

    getConfigOffset(passResponse: number[], cfgOffset: number) {
        if ((passResponse != null) && (passResponse.length >= 8)) {
          // success
          if ((passResponse[0] == 0x00) && (passResponse[1] == 0x04)) {
            // tag is from NXP
            if (passResponse[2] == 0x03) {
              // MIFARE Ultralight
              if ((passResponse[4] == 0x01) && (passResponse[5] == 0x00)) {
                // MIFARE Ultralight EV1 (V0)
                switch (passResponse[6]) {
                  case 0x0B:
                    // MF0UL11
                    return 0x010;
                    break;
                  case 0x0E:
                    // MF0UL11
                    return 0x025;
                    break;
      
                  default:
                    // unknown
                    break;
                }
              }
            }
            if (passResponse[2] == 0x04) {
              // NTAG
              switch (passResponse[6]) {
                //NTAG 213
                case 0x0F: return 0x29;
                // NTAG 215
                case 0x13: return 0xE3;
              }
            }
          }
        }
        return cfgOffset;
      }

      static FIRST_DATA_PAGE = 4

}
