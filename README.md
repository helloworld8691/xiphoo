# Xiphoo App

Most important file: `./config.ts`. Hier ist die ganze Konfiguration.

## Getting started

to get started make sure yarn and node is installed.

1. Install packages: in project root run `yarn`
2. To install the app on android run `yarn android`
3. After the app is installed, run `yarn start` to start the development server


# Directory Structure

  - src
    - this contains all the react native stuff
  - android
    - this is the android folder containing the signing key, manifest, MainActivity and signing key passwords
  - ios
    - this is the IOS Folder which is not used yet
  - public
    - webroot for the small android screen


## React native

The React Native (src) folder is divided into the following:
* api (contains the Xiphoo Api)
* assets (contains images and logos)
* base (contains the Theme and the main Styles)
* components (contains all smaller React Native Components)
* hooks (custom hooks)
* lib (Crypto and other helpers)
* redux (containing the global app state)
* views (containing all the Views)
  

## Redux

Most of the functionality of the App is implemented in Redux (using thunk as an async helper). The Redux folder is structured into auth (user authentication and login), productRegistration (fetching product details), scanProduct (verifying the authenticity of the product (client usecase)) and the settings.

## NFC Read and Verify

The NFC Reader is implemented in the following way:

* get Tag (get ndef records and tag uid)
* verify first cipher offline
* verify first cipher online
* if fail do the same for cipher 2
* patch the nfc tag to update the ciphers

## Patching the NFC Tag

Since the NFC Tag has to be NDEF formatted to be readable by IOS and Android the, the Records cannot be cleanly written.

### Data Layout of the Tag
```
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
37 [53,54,55,END_BYTE] Cipher2 Data
```

Since the NDef Records are not a Full page we patch only the data record and the info. This also assures a better security since the records are only overwritten in the Data Segment and the Headers are untouched.

To write record 1 we start at page 11 and write til page 23.

To write record 2 we start at page 25 and write til page 37.

This way the header stays almost completely untouched.

here a short snippet of that functionality in the app:

```javascript
function getPatch(){
  [...]
  if (validRecordNo == 2) {
    return [0x03, 0x78, 0x70, nextCipherId, ...cipherBuffer]
  }
  else {
    return [0x78, 0x70, nextCipherId, ...cipherBuffer, 0xFE]
  }
}

```

