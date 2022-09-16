import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { Platform } from 'react-native';
import { ISO14443OperatorInterface } from './operators/ISO14443OperatorInterface';
import { ISO14443Operator } from './operators/ISO14443Operator';
import { ISO15693OperatorInterface } from './operators/ISO15693OperatorInterface';
import { ISO15693Operator } from './operators/ISO15693Operator';

export class NFCOperationManager  {

    static async requestAllSupportedTechs() {
        console.log('NFC: Request techs');
        if (Platform.OS == 'android') return await NfcManager.requestTechnology([NfcTech.NfcA, NfcTech.NfcV]);
        else if (Platform.OS == 'ios') return await NfcManager.requestTechnology([NfcTech.MifareIOS, NfcTech.Iso15693IOS]); 
    }

    static cancelRequest(): void {
        console.log('NFC: Cancel request');
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }

    static start(): void {
        console.log('NFC: Start communication');
        NfcManager.start();
        NfcManager.setEventListener(NfcEvents.DiscoverTag, () => {});
        NfcManager.registerTagEvent().catch(() => 0);
    }

    static stop(): void {
        console.log('NFC: Stop communication');
        NfcManager.unregisterTagEvent().catch(() => 0);
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }

    static createISO14443operator(): ISO14443OperatorInterface {
        return new ISO14443Operator()
    }

    static createISO15693operator(): ISO15693OperatorInterface {
        return new ISO15693Operator()
    }

    static toHexArray(bytes: number[]) : string{
        return "HEX: [" + bytes.reduce((output, elem) => 
            (output + " " + ('0' + elem.toString(16)).slice(-2)) +",",
        '').toUpperCase().slice(0, -1)/* clean trailing comma*/ + " ]";
      }
}