import { ISO15693OperatorInterface } from "./ISO15693OperatorInterface";
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { Platform } from 'react-native';
import { ISO15693 } from "../protocols/ISO15693";

export class ISO15693Operator implements ISO15693OperatorInterface {

    async select(uid: number[]) : Promise<Boolean> {
        console.log("NFC: Selecting ")  
        if (Platform.OS == 'android') {
            let command = [ 
                ISO15693.FLAG_DATA_RATE_HIGH | ISO15693.FLAG_ADDRESS_MODE, 
                ISO15693.CMD_SELECT,
                ...uid]
            console.log("NFC: Selecting with ", ISO15693Operator.toHexArray(command)) 
            let result = await NfcManager.transceive(command) 
            console.log("NFC: Selecting result", result)  
            return new Promise<Boolean>((resolve, reject) => {
                resolve(true);
            });
        }
        else if (Platform.OS == 'ios')  {
            await NfcManager.iso15693HandlerIOS.select({
                flags: ISO15693.FLAG_DATA_RATE_HIGH | ISO15693.FLAG_ADDRESS_MODE}) 
            console.log("NFC: Selecting done")  
            return new Promise<Boolean>((resolve, reject) => {
                resolve(true);
            });
        }
        return new Promise<Boolean>((resolve, reject) => {
            resolve(true);
        });
    }

    async writeBlock(pageIndex: number, bytes: [number, number, number, number]): Promise<number[]> {
        console.log("NFC: Transceiving ", ISO15693Operator.toHexArray(bytes))            
            
        if (Platform.OS == 'android') {
            let command = [ 
                ISO15693.FLAG_DATA_RATE_HIGH, 
                ISO15693.CMD_WRITE_SINGLE_BLOCK,
                pageIndex, 
                ...bytes]
            return await NfcManager.transceive(command) 
        }
        else if (Platform.OS == 'ios')  {
            if (NfcManager.iso15693HandlerIOS) {
                NfcManager.iso15693HandlerIOS.writeSingleBlock({
                    flags: ISO15693.FLAG_DATA_RATE_HIGH, 
                    blockNumber: pageIndex, 
                    dataBlock: bytes}) // NOTE: no error code from iOS implementation
            }
        
            return new Promise<number[]>((resolve, reject) => {
                resolve([]);
            });
        } else {
            return new Promise<number[]>((resolve, reject) => {
                resolve([]);
            });  
        }

    }

    async invokeCustomCommand(status: number, cmd: number, manufacturerCode: number, data: number[]): Promise<number[]> {
        console.log("NFC: Invoking custom command with request")
       
        if (Platform.OS == 'android') {
            let command = [ 
                status, 
                cmd,
                manufacturerCode,
                ...data]
            console.log("NFC: Command: ", ISO15693Operator.toHexArray(command))
            return await NfcManager.transceive(command) 
        }
        else if (Platform.OS == 'ios')  {
            let message = [...data]
            console.log("NFC: Status:", ISO15693Operator.toHexArray([status]));
            console.log("NFC: Cmd:", ISO15693Operator.toHexArray([cmd])), 
            console.log("NFC: Message:", ISO15693Operator.toHexArray(message));     
            if (NfcManager.iso15693HandlerIOS) {
                // It is crucial to know that customCommand() implementation on iOS 
                // will add manufacturer ID before the [message] - however this is not documented anywhere
                // it was figured out empirically. Note also that since iOS 14.x there is a method 
                // sendRequest() which seem to be roughly equal to android transceive()  
                // But currently this is not included into react native nfc manager  
                let response = await NfcManager.iso15693HandlerIOS.customCommand({
                    flags: status, 
                    customCommandCode: cmd, 
                    customRequestParameters: message}) 
                    console.log("NFC: Response", ISO15693Operator.toHexArray(response)) 
                    // iOS customCommand() implementation "swallows" the first response byte which is 
                    // a flag indicating error or success. in error case it will throw exception 
                    // in ok case it will forward the response. But the client which calls us at 
                    // this method (invokeCustomCommand()) does not know about platform specifica 
                    // thus it expects consistent response, thus we need to add "ok" status flag    
                    return [0x00, ...response]
                    
            }
            return new Promise<number[]>((resolve, reject) => {
                resolve([]);
            });  

        } else {
            return new Promise<number[]>((resolve, reject) => {
                resolve([]);
            });  
        } 
    }


    static toHexArray(bytes: number[]) : string{
        return "HEX: [" + bytes.reduce((output, elem) => 
            (output + " " + ('0' + elem.toString(16)).slice(-2)) +",",
        '').toUpperCase().slice(0, -1)/* clean trailing comma*/ + " ]";
      }

}