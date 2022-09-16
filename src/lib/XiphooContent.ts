import {NdefRecord} from 'react-native-nfc-manager';

const tagIdRe = /^7870([\w\d][\w\d])$/;


//Data Layout
/** 
00 [1,2,3,4] DATA
01 [1,2,3,4] DATA
02 [1,2,3,4] DATA
03 [1,2,3,4] DATA
04 [1,2,3,4] URL
05 [1,2,3,4] URL
06 [1,2,3,4] URL
07 [1,2,3,4] URL
08 [1,2,3,4] URL
09 [1,2,3,4] URL
10 [URL, 01, 02 ,03] Cipher Header
11 [04,05,06,07] Cipher Header
12 [08,09,10,11] Cipher Data
13 [12,13,14,15] Cipher Data
14 [16,17,18,19] Cipher Data
15 [20,21,22,23] Cipher Data
16 [24,25,26,27] Cipher Data
17 [28,29,30,31] Cipher Data
18 [32,33,34,35] Cipher Data
19 [36,37,38,39] Cipher Data
20 [40,41,42,43] Cipher Data
21 [44,45,46,47] Cipher Data
22 [48,49,50,51] Cipher Data
23 [52,53,54,55] Cipher Data
24 [01,02,03,04] Cipher2 Header
25 [05,06,07,08] Cipher2 Header + Data
26 [09,10,11,12] Cipher2 Data
27 [13,14,15,16] Cipher2 Data
28 [17,18,19,20] Cipher2 Data
29 [21,22,23,24] Cipher2 Data
30 [25,26,27,28] Cipher2 Data
31 [29,30,31,32] Cipher2 Data
32 [33,34,35,36] Cipher2 Data
33 [37,38,39,40] Cipher2 Data
34 [41,42,43,44] Cipher2 Data
35 [45,46,47,48] Cipher2 Data
36 [49,50,51,52] Cipher2 Data
37 [53,54,55,56] Cipher2 Data



 */

/**
[ 04:5E:27:F5 ] Sektor 00 : UID0 - UID2 / BCC0
[ D2:9C:39:80 ] Sektor 01 : UID3 - UDI6
[ F7:48:00:00 ] Sektor 02 : BCC1 / INT. / LOCK0 - LOCK1
[ E1:11:6D:00 ] Sektor 03 : OTP0 - OTP3
[ 03:A9:94:0F ] Sektor 04 : DATA
[ 0E:61:6E:64 ] Sektor 05 : DATA
[ 72:6F:69:64 ] Sektor 06 : DATA
[ 2E:63:6F:6D ] Sektor 07 : DATA
[ 3A:70:6B:67 ] Sektor 08 : DATA
[ 63:6F:6D:2E ] Sektor 09 : DATA
[ 78:69:70:68 ] Sektor 0A : DATA
[ 6F:6F:2E:61 ] Sektor 0B : DATA
[ 70:70:11:01 ] Sektor 0C : DATA
[ 17:55:03:73 ] Sektor 0D : DATA
[ 63:61:6E:2E ] Sektor 0E : DATA
[ 78:69:70:68 ] Sektor 0F : DATA
[ 6F:6F:2E:63 ] Sektor 10 : DATA
[ 6F:6D:2F:6C ] Sektor 11 : DATA
[ 69:6E:6B:2F ] Sektor 12 : DATA
[ 31:1D:00:30 ] Sektor 13 : DATA
[ 03:78:70:02 ] Sektor 14 : DATA 1 Start
[ 00:00:00:00 ] Sektor 15 : DATA
[ 00:00:00:00 ] Sektor 16 : DATA
[ 00:00:00:00 ] Sektor 17 : DATA
[ 00:00:00:00 ] Sektor 18 : DATA
[ 00:00:00:00 ] Sektor 19 : DATA
[ 00:00:00:00 ] Sektor 1A : DATA
[ 00:00:00:00 ] Sektor 1B : DATA
[ 00:00:00:00 ] Sektor 1C : DATA
[ 00:00:00:00 ] Sektor 1D : DATA
[ 00:00:00:00 ] Sektor 1E : DATA
[ 00:00:00:00 ] Sektor 1F : DATA
[ 00:00:00:00 ] Sektor 20 : DATA 1 END
[ 5D:00:30:03 ] Sektor 21 : DATA 
[ 78:70:01:00 ] Sektor 22 : DATA 2 Start
[ 00:00:00:00 ] Sektor 23 : DATA 
[ 00:00:00:00 ] Sektor 24 : DATA
[ 00:00:00:00 ] Sektor 25 : DATA
[ 00:00:00:00 ] Sektor 26 : DATA
[ 00:00:00:00 ] Sektor 27 : DATA
[ 00:00:00:00 ] Sektor 28 : DATA
[ 00:00:00:00 ] Sektor 29 : DATA
[ 00:00:00:00 ] Sektor 2A : DATA
[ 00:00:00:00 ] Sektor 2B : DATA
[ 00:00:00:00 ] Sektor 2C : DATA
[ 00:00:00:00 ] Sektor 2D : DATA
[ 00:00:00:FE ] Sektor 2E : DATA 2 END
 */

export class XiphooContent {

    // both are offsets to first user writable page
    static PAGE_START_CIPHER1 = 0x08;
    static PAGE_START_CIPHER2 = 0x16;
    
    static cipherEntryExists(messages: NdefRecord[]): boolean {
      console.log(messages)
      if (!messages) return false;
      for (const message of messages) {
        if(message.id && (message.id[0] == 0x78 || message.id[1] == 0x70)) return true;
        if (message.id && tagIdRe.test(message.id.toString())) return true;
      }
      return false;
    }
    
    static getCurrentSequenceNumber(
      messages: NdefRecord[],
    ): number | undefined {
      if (!messages) return undefined;
      let max = undefined;
      for (const message of messages) {
        if (message.id && tagIdRe.test(message.id.toString())) {
          let sequenceNumberString = tagIdRe.exec(message.id.toString())?.[1];
          if (sequenceNumberString) {
            let sequenceNumber = parseInt(sequenceNumberString);
            if (!max || max < sequenceNumber) max = sequenceNumber;
          }
        }
      }
      return max;
    }
    
    static getCurrentRecord(
      messages: NdefRecord[],
    ): NdefRecord | undefined {
      if (!messages) return undefined;
      let max = undefined;
      let current: NdefRecord | undefined = undefined;
      for (const message of messages) {
        if (message.id && tagIdRe.test(message.id.toString())) {
          let sequenceNumberString = tagIdRe.exec(message.id.toString())?.[1];
          if (sequenceNumberString) {
            let sequenceNumber = parseInt(sequenceNumberString);
            if (!max || max < sequenceNumber) {
              max = sequenceNumber;
              current = message;
            }
          }
        }
      }
      return current;
    }
    
    static getLastRecord(
      messages: NdefRecord[],
    ): NdefRecord | undefined {
      if (!messages) return undefined;
      let min = undefined;
      let current: NdefRecord | undefined = undefined;
      for (const message of messages) {
        if (message.id && tagIdRe.test(message.id.toString())) {
          let sequenceNumberString = tagIdRe.exec(message.id.toString())?.[1];
          if (sequenceNumberString) {
            let sequenceNumber = parseInt(sequenceNumberString);
            if (!min || min > sequenceNumber) {
              min = sequenceNumber;
              current = message;
            }
          }
        }
      }
      return current;
    }
    
    static getSequenceNumber(val?: string = ""){
      let sequenceNumber = tagIdRe.exec(val.toString())?.[1];
      if (sequenceNumber)
        return parseInt(sequenceNumber);
      return -1;
    }

    static getRecordToWrite(record: NdefRecord & { no: number }, res: { newCipher: string; password: string }) {
        let bytes = XiphooContent.buildPayload(record, res.newCipher, record.no);
        let pageStart = record.no == 1 ? XiphooContent.PAGE_START_CIPHER2 : XiphooContent.PAGE_START_CIPHER1;
        return { bytes, pageStart };
      }

    static buildPayload(current: NdefRecord, newCipher: string, validRecordNo: number) {
        let id = [...Buffer.from((current.id as any) ?? '0', 'hex')];
        const nextId = ((id[2] ?? 1) + 1) % 256;
        const cipherBuffer = Buffer.from(newCipher, 'base64');
        if (validRecordNo == 2) {
          // NOTE that it is not quite clear what this 0x03 means. Here we are trying write in the middle of 
          // the existing NDEF record and 0x03 is indeed the byte which preceeds our NDEF record ID (78 70 nn)
          // So this could be either NDEF related byte or last byte ofr URL. Thus this place remains fragile
          // If data length or contect will be changed it will stop working
          return [0x03, 0x78, 0x70, nextId, ...cipherBuffer];
        } else {
          return [0x78, 0x70, nextId, ...cipherBuffer, 0xfe];
        }
      }
    
    static getSortedRecords(
      messages: NdefRecord[],
    ): (NdefRecord & {no: number})[] | undefined {
      if (!messages) return undefined;
    
      let a = {...messages[1], no: 1};
      let b = {...messages[2], no: 2};
    
    
      let seqA = XiphooContent.getSequenceNumber(a.id), seqB = XiphooContent.getSequenceNumber(b.id);
    
      // return higher as long as no Arithmetic overflow
      if (seqA < seqB && !(seqA < 5 && seqB > 240))
        return [b, a];
      else 
        return [a, b]
    
      // return messages.filter(m=> m.tnf == 5 && m.id && tagIdRe.test(m.id.toString())).map(m=> ({...m, sequenceNumber: getSequenceNumber(m.id)})).sort((a,b)=> b.sequenceNumber-a.sequenceNumber)
    }
}