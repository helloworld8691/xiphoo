
import { TestTagEvent }  from "../__mocks__/TestTagEvent";
import { ICODESlixTag } from "../src/tags/ICODESlixTag";
import { ISO15693Tag } from "../src/tags/ISO15693Tag";
import { ISO15693 } from "../src/tags/protocols/ISO15693";
import { NDEF } from "../src/tags/protocols/NDEF";
import { ICODESlix2Tag } from "../src/tags/ICODESlix2Tag";
import { MockedISO15693Operator } from "../__mocks__/MockedISO15693Operator";
import { ISO15693Operator } from "../src/tags/operators/ISO15693Operator";

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);

describe('ICODE SLIX Tag', () => {

    it('correctly writes password', async () => {
        const operator = createOperator()
        const tag = createTag(operator);
        const password:  [number, number, number, number] = [0x01, 0x02, 0x03, 0x04]
        await tag.setPasswordForWriting(password)
        const response = operator.customCommands
        console.log(response)
        expect(response).not.toBeNull

        const uid = tag.uidAs64BitNumber()
  
        expect(response[0]).toEqual(ISO15693.FLAG_ADDRESS_MODE);
        expect(response[1]).toEqual(ICODESlixTag.CMD_WRITE_PASSWORD);
        expect(response[2]).toEqual(ICODESlixTag.MANUFACTURER_CODE); 

        expect(response[3]).toEqual(uid[0]);
        expect(response[4]).toEqual(uid[1]);
        expect(response[5]).toEqual(uid[2]);
        expect(response[6]).toEqual(uid[3]);
        expect(response[7]).toEqual(uid[4]);
        expect(response[8]).toEqual(uid[5]);
        expect(response[9]).toEqual(uid[6]);
        expect(response[10]).toEqual(uid[7]);

        expect(response[11]).toEqual(ICODESlixTag.PASSWORD_IDENTIFIER_WRITE); 

        expect(response[12]).toEqual(password[0]);
        expect(response[13]).toEqual(password[1]);
        expect(response[14]).toEqual(password[2]);
        expect(response[15]).toEqual(password[3]);
   
    });


});

function createOperator() : MockedISO15693Operator {
    return new MockedISO15693Operator()
}

function createTag(operator: ISO15693Operator) : ICODESlixTag {
    const event = new TestTagEvent();
    const typeVmagic = 0xE0
    event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, ICODESlix2Tag.TYPE, ICODESlixTag.MANUFACTURER, typeVmagic];
    const tag = new ICODESlixTag(event, operator);
    return tag
}
