import { Tag } from "./Tag";
import { NFCOperationManager } from "./NFCOperationManager";
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { ISO14443Tag } from "./ISO14443Tag";
import { ISO15693Tag } from "./ISO15693Tag";
import { ICODESlix2Tag } from "./ICODESlix2Tag";
import { ICODESlixSTag } from "./ICODESlixSTag";

export class TagFactory { 
    public static createTag(tag: TagEvent | null | undefined): Tag | null  {
        if (tag == null || tag == undefined ) {
            console.log("NFC", "Cannot create tag - event is null")
            return null  
        } else {
            // NOTE that once again TagEvent defined by natif NFC manager does not match the type coming from iOS 
            if (tag!.techTypes === undefined)  { // this is IOS
                let tech = (tag! as any).tech
                if (tech) {
                    if (tech!.includes("mifare")){
                        return TagFactory.createISO14443Tag(tag!)
                    } else if (tech!.includes("iso15693")){
                        // Type 5 uid is read in reverse order (MSB <- LSB) so we rotate it here
                        tag!.id = TagFactory.hexStringToBytes(Tag.extractUID(tag!)).reverse()
                        return TagFactory.createISO15693Tag(tag!)   
                    }  
                } else {
                    console.log("NFC", "Cannot create tag - iOS format not recognized")
                }
            } else { // android format 
                if ( tag!.techTypes!.includes("android.nfc.tech.NfcA")) {
                    return TagFactory.createISO14443Tag(tag!)
                } else if ( tag!.techTypes!.includes("android.nfc.tech.NfcV")) {
                    return TagFactory.createISO15693Tag(tag!)
                } else {
                    console.log("NFC", "Cannot create tag - Android format not recognized")
                }
            }
      }
      return null
    }

    private static createISO14443Tag(tag: TagEvent) : Tag {
        let newTag = new ISO14443Tag(tag, NFCOperationManager.createISO14443operator())
        console.log("NFC", "Created tag: ", newTag.name())
        return newTag
    }

    private static createISO15693Tag(tag: TagEvent) : Tag {
        let operator = NFCOperationManager.createISO15693operator()
        let newTag = new ISO15693Tag(tag, operator)
        if (newTag.manufacturer == ICODESlix2Tag.MANUFACTURER && newTag.type == ICODESlix2Tag.TYPE) {
            newTag = new ICODESlix2Tag(tag, operator)
        } 
        if (newTag.manufacturer == ICODESlixSTag.MANUFACTURER && newTag.type == ICODESlixSTag.TYPE) {
            newTag = new ICODESlixSTag(tag, operator)
        } 
        console.log("NFC", "Created tag: ", newTag.name())
        return newTag
    }

    private static hexStringToBytes(hex: string) : number[] {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substring(c, c + 2), 16));
        return bytes;
    }
  
}