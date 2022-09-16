import { TagEvent, NdefRecord } from 'react-native-nfc-manager';

export class TestTagEvent implements TagEvent {
    ndefMessage: NdefRecord[] = []
    maxSize?: number;
    type?: string;
    techTypes?: string[];
    id?: number[];
}