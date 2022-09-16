// import { Ndef, NdefRecord } from 'react-native-nfc-manager';


const URL_LENGTH = 25, CIPHER_LENGTH = 55, OFFSET = 4*4;



function buildPayload(current: null, newCipher: string) {
  return [...new Array(55).fill(2).map((_,i)=>i+1)];
}



let bytes = buildPayload(null, Buffer.from(new Uint8Array(new Array(48).fill(1))).toString("base64"));
// await authenticate(res);

let count = 1;

let offsetInBytes = OFFSET + URL_LENGTH + (count % 2) * CIPHER_LENGTH;
const cutOff = (4 - offsetInBytes % 4)%4;
let payload = bytes.slice(cutOff);

if (count == 0) {
  payload = [...payload, ...bytes.slice(0, payload.length % 4)]
}
else
  payload = [...payload, ...[0, 0, 0, 0, 0, 0].slice(0, (4 - payload.length % 4)%4)]

payload.length//?

  
let pageStart = Math.ceil(offsetInBytes / 4);
pageStart


console.log("🚀 ~ file: thunk.ts ~ line 136 ~ startValidationProcess ~ Math.floor(55 / 4)", Math.floor(55 / 4))
for (let index = 0; index < Math.floor(payload.length / 4)/*?*/; index++) {
  // await NfcManager.transceive([
  //   0xA2, // WRITE
  //   pageStart + index,
  //   ...payload.slice(index*4, (index+1)*4)
  // ])
}


/** 
00 [1,2,3,4] DATA
01 [1,2,3,4] DATA
02 [1,2,3,4] DATA
04 [1,2,3,4] DATA
03 [1,2,3,4] URL
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