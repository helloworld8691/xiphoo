import { Platform } from 'react-native';
import NfcManager, { Ndef, NfcEvents, NfcTech } from 'react-native-nfc-manager';


let PACK = [0x9A, 0xBC]


export async function setPassword(password: [number, number, number, number]) {
  let cfgOffset = -1;

  let version = await NfcManager.transceive([
    0x60 // GET_VERSION
  ]);

  cfgOffset = getConfigOffset(version, cfgOffset);

  console.log("🚀 ~ file: nfcHelpers.ts ~ line 13 ~ setPassword ~ passResponse", version.map(b => b.toString(16).toUpperCase()).join(":"))

  console.log("🚀 ~ file: nfcHelpers.ts ~ line 44 ~ setPassword ~ cfgOffset", cfgOffset.toString(16))

  if (cfgOffset == -1) return false;
  let packResponse = await NfcManager.transceive([
    0xA2, // WRITE
    ((cfgOffset + 2) & 0x0FF),    // page address
    password[0], password[1], password[2], password[3]  // new page data
  ]);
  packResponse = await NfcManager.transceive([
    0xA2, // WRITE
    ((cfgOffset + 3) & 0x0FF),     // page address
    PACK[0], PACK[1], 0x00, 0x00  // new page data (always need to write full page)
  ])


  let fromPageNum = 4, enableProtection = true, enableReadProtection = false;

  let response = await NfcManager.transceive([
    0x30, // READ
    (cfgOffset & 0x0FF)  // page address
  ]);
  if ((response != null) && (response.length >= 16)) {
    // success
    // NOTE that READ will return *4 pages* starting at page address
    let auth0 = 0xFF;
    if (enableProtection || enableReadProtection) {
      auth0 = (fromPageNum & 0x0FF);
    }
     // TODO: Add error detection for this operation as far as error specification of ISO 14443 will be available
    let writeResponse = await NfcManager.transceive([
      0xA2, // WRITE
      ((cfgOffset + 0) & 0x0FF),              // page address
      response[0], response[1], response[2], auth0  // new page data
    ]);

    let access = (response[4] & 0x07F);
    if (enableProtection && enableReadProtection) {
      access |= 0x80;
    }
     // TODO: Add error detection for this operation as far as error specification of ISO 14443 will be available
    writeResponse = await NfcManager.transceive([
      0xA2, // WRITE
      ((cfgOffset + 1) & 0x0FF),                // page address
      access, response[5], response[6], response[7],  // new page data
    ]);
  }
  else return false;
  return true;
}



// NTAG 213 version: 0:4:4:2:1:0:F:3
//NTAG 215 Version: 0:4:4:2:1:0:13:3

function getConfigOffset(passResponse: number[], cfgOffset: number) {
  if ((passResponse != null) && (passResponse.length >= 8)) {
    // success
    if ((passResponse[0] == 0x00) && (passResponse[1] == 0x04)) {
      // tag is from NXP
      if (passResponse[2] == 0x03) {
        // MIFARE Ultralight
        if ((passResponse[4] == 0x01) && (passResponse[5] == 0x00)) {
          // MIFARE Ultralight EV1 (V0)
          switch (passResponse[6]) {
            case 0x0B:
              // MF0UL11
              return 0x010;
              break;
            case 0x0E:
              // MF0UL11
              return 0x025;
              break;

            default:
              // unknown
              break;
          }
        }
      }
      if (passResponse[2] == 0x04) {
        // NTAG
        switch (passResponse[6]) {
          //NTAG 213
          case 0x0F: return 0x29;
          // NTAG 215
          case 0x13: return 0xE3;
        }
      }
    }
  }
  return cfgOffset;
}


export async function authenticate(password: [number, number, number, number]) {
  if(Platform.OS == "android")
  var resp = await NfcManager.transceive([0x1B, ...password])
  else
  var resp = await NfcManager.sendMifareCommandIOS([0x1B, ...password])
  return resp[0] == PACK[0] && resp[1] == PACK[1]
}