
import { TestTagEvent }  from "../__mocks__/TestTagEvent";
import { ISO15693Tag } from "../src/tags/ISO15693Tag";
import { ISO15693 } from "../src/tags/protocols/ISO15693";
import { NDEF } from "../src/tags/protocols/NDEF";
import { MockedISO15693Operator } from "../__mocks__/MockedISO15693Operator";
import { ISO15693Operator } from "../src/tags/operators/ISO15693Operator";

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);

describe('ISO 15693 Tag', () => {

    it('creates an ISO 15693 tag from valid event', () => {
        const operator = createOperator()
        const tag = createTag(operator);
        expect(tag.uid).toEqual("16A8FD31080104");
        expect(tag.manufacturer).toEqual(0x04);
        expect(tag.type).toEqual(0x01);
    });

    it('correctly writes NDEF record: minimal payload', async () => {
        const operator = createOperator()
        const tag = createTag(operator);
        const payload = [0x01, 0x02, 0x03, 0x04]
        await tag.formatAndWriteNdefRecords(payload)
        const response = operator.transceived
        console.log(response)
        expect(response).not.toBeNull
        // record 1
        expect(response[0]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[1]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[2]).toEqual(0); // page index
        expect(response[3]).toEqual(ISO15693.CC_MAGIC_BYTE);
        expect(response[4]).toEqual(ISO15693.CC_VERSION);
        expect(response[5]).toEqual(1); // payload + TLV wrapper.length / 8 (ceiled)
        expect(response[6]).toEqual(0); // feature flag 

        // record 2
        expect(response[7]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[8]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[9]).toEqual(1); // page index
        expect(response[10]).toEqual(NDEF.TLV_NDEF_ID);
        expect(response[11]).toEqual(payload.length);
        expect(response[12]).toEqual(payload[0]); 
        expect(response[13]).toEqual(payload[1]); 

        // record 3
        expect(response[14]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[15]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[16]).toEqual(2); // page index
        expect(response[17]).toEqual(payload[2]); 
        expect(response[18]).toEqual(payload[3]); 
        expect(response[19]).toEqual(NDEF.TLV_TERMINATOR); 
        expect(response[20]).toEqual(0x0); 
   
    });

    it('correctly writes NDEF record: two-page uneven payload', async () => {
        const operator = createOperator()
        const tag = createTag(operator);
        const payload = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06]
        await tag.formatAndWriteNdefRecords(payload)
        const response = operator.transceived
        console.log(response)
        expect(response).not.toBeNull
        // record 1
        expect(response[0]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[1]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[2]).toEqual(0); // page index
        expect(response[3]).toEqual(ISO15693.CC_MAGIC_BYTE);
        expect(response[4]).toEqual(ISO15693.CC_VERSION);
        expect(response[5]).toEqual(2); // payload + TLV wrapper.length / 8 (ceiled)
        expect(response[6]).toEqual(0); // feature flag 

        // record 2
        expect(response[7]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[8]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[9]).toEqual(1); // page index
        expect(response[10]).toEqual(NDEF.TLV_NDEF_ID);
        expect(response[11]).toEqual(payload.length);
        expect(response[12]).toEqual(payload[0]); 
        expect(response[13]).toEqual(payload[1]); 

        // record 3
        expect(response[14]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[15]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[16]).toEqual(2); // page index
        expect(response[17]).toEqual(payload[2]); 
        expect(response[18]).toEqual(payload[3]); 
        expect(response[19]).toEqual(payload[4]); 
        expect(response[20]).toEqual(payload[5]); 

        // record 4
        expect(response[21]).toEqual(ISO15693.FLAG_DATA_RATE_HIGH);
        expect(response[22]).toEqual(ISO15693.CMD_WRITE_SINGLE_BLOCK);
        expect(response[23]).toEqual(3); // page index
        expect(response[24]).toEqual(NDEF.TLV_TERMINATOR); 
        expect(response[25]).toEqual(0x0); 
        expect(response[26]).toEqual(0x0); 
        expect(response[27]).toEqual(0x0); 
   
    });

    it('properly detects error', () => {
        expect(ISO15693Tag.isError([0x0])).not.toBeTruthy
        expect(ISO15693Tag.isError([ISO15693.FLAG_ERROR])).toBeTruthy
    });

    it('format record offest', () => {
        const operator = createOperator()
        const tag = createTag(operator);
        expect(tag.formatHeaderOffset()).toEqual(1)
    });

    it('properly converts UID to string', () => {
        const uid: [number, number, number, number, number, number, number, number] = [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x04, 0xE0]
        const operator = createOperator()
        const tag = createTagWithUID(operator, uid);
        expect(tag.uidAs64BitNumber()).toEqual(uid)
    });

});

function createOperator() : MockedISO15693Operator {
    return new MockedISO15693Operator()
}

function createTag(operator: ISO15693Operator) : ISO15693Tag {
    const event = new TestTagEvent();
    const typeVmagic = 0xE0
    event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, 0x01, 0x04, typeVmagic];
    const tag = new ISO15693Tag(event, operator);
    return tag
}

function createTagWithUID(operator: ISO15693Operator, uid: [number, number, number, number, number, number, number, number]) : ISO15693Tag {
    const event = new TestTagEvent();
    event.id = uid
    const tag = new ISO15693Tag(event, operator);
    return tag
}