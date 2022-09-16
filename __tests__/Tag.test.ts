import { Tag } from "../src/tags/Tag";
import { TestTagEvent }  from "../__mocks__/TestTagEvent";
import TagEvent, { NfcTech } from 'react-native-nfc-manager';
import { ISO14443Tag } from "../src/tags/ISO14443Tag";
import { ISO15693Tag } from "../src/tags/ISO15693Tag";
import { TagFactory } from "../src/tags/TagFactory";
import { MockedISO14443Operator } from "../__mocks__/MockedISO14443Operator";

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter',
);


describe('Tag', () => {

    it('creates an ISO 14443 tag from valid event', () => {
      const event = new TestTagEvent();
      event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, 0x01, 0x04];
      const tag = new ISO14443Tag(event, new MockedISO14443Operator());
      expect(tag.uid).toEqual("16A8FD31080104");
    });


      it('factory creates proper ISO 4443 tag', () => {
        const event = new TestTagEvent();
        event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, 0x01, 0x04];
        event.techTypes = ["android.nfc.tech.NfcA"]
        const tag = TagFactory.createTag(event)
        expect(tag).not.toBeNull
        expect(tag!.name()).toEqual("Generic ISO 14443");
      });

      it('factory creates proper ISO 15693 tag', () => {
        const event = new TestTagEvent();
        event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, 0x00, 0x00, 0xE0];
        event.techTypes = ["android.nfc.tech.NfcV"]
        const tag = TagFactory.createTag(event)
        expect(tag).not.toBeNull
        expect(tag!.name()).toEqual("Generic ISO 15693");
      });

      it('factory creates proper ISO Slix tag', () => {
        const event = new TestTagEvent();
        const typeVmagic = 0xE0
        const manufacturer = 0x04 
        const type = 0x01
        event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, type, manufacturer, typeVmagic];
        event.techTypes = ["android.nfc.tech.NfcV"]
        const tag = TagFactory.createTag(event)
        expect(tag).not.toBeNull
        expect(tag!.name()).toEqual("ICODE Slix-2 (ISO 15693)");
      });


      it('factory creates proper ISO Slix tag', () => {
        const event = new TestTagEvent();
        const typeVmagic = 0xE0
        const manufacturer = 0x04 
        const type = 0x02
        event.id = [0x16, 0xA8, 0xFD, 0x31, 0x08, type, manufacturer, typeVmagic];
        event.techTypes = ["android.nfc.tech.NfcV"]
        const tag = TagFactory.createTag(event)
        expect(tag).not.toBeNull
        expect(tag!.name()).toEqual("ICODE Slix-S (ISO 15693)");
      });

  });