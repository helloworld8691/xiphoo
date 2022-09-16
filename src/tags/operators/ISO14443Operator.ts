import { ISO14443OperatorInterface } from "./ISO14443OperatorInterface";
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { ISO14443 } from "../protocols/ISO14443";

export class ISO14443Operator implements ISO14443OperatorInterface {

    transceive(bytes: number[]): Promise<number[]> {
        console.log("NFC: Transceiving ", ISO14443Operator.toHexArray(bytes))
        return new Promise<number[]>((resolve, reject) => {
            // somehow nfcAHandler works for both platforms 
            resolve(NfcManager.nfcAHandler.transceive(bytes));
        });
    }

    readBlocks(pageIndex: number): Promise<number[]> {
        console.log("NFC: Write block ", pageIndex);
        return new Promise<number[]>((resolve, reject) => {
            resolve(this.transceive([ISO14443.CMD_READ, pageIndex]));
        });
    }

    writeBlock(pageIndex: number, bytes: [number, number, number, number]): Promise<number[]> {
        console.log("NFC: Write block ", pageIndex);
        return new Promise<number[]>((resolve, reject) => {
            resolve(this.transceive([ISO14443.CMD_WRITE, pageIndex, ...bytes]));
        });
    }

    static toHexArray(bytes: number[]) : string{
        return "HEX: [" + bytes.reduce((output, elem) => 
            (output + " " + ('0' + elem.toString(16)).slice(-2)) +",",
        '').toUpperCase().slice(0, -1)/* clean trailing comma*/ + " ]";
      }
}