import { Buffer } from 'buffer'
//@ts-ignore
import * as crypto from './crypto';
//@ts-ignore
import asn1 from 'asn1.js';
//@ts-ignore
import BN from 'bn.js';
const PUBKEY = `-----BEGIN PUBLIC KEY-----
MD4wEAYHKoZIzj0CAQYFK4EEAAgDKgAEHrW5LTdXMDKZF6IPokem0mI38VD9cnP+6AS4gQCPIBmMEthClBMqbQ==
-----END PUBLIC KEY-----`;

const EcdsaDerSig = asn1.define('ECPrivateKey', function () {
  //@ts-ignore
  return this.seq().obj(this.key('r').int(), this.key('s').int()
  );
});

function concatSigToAsn1Sig(concatSigBuffer: Buffer) {
  const r = new BN(concatSigBuffer.slice(0, 20).toString('hex'), 16, 'be');
  const s = new BN(concatSigBuffer.slice(20).toString('hex'), 16, 'be');
  return EcdsaDerSig.encode({ r, s }, 'der');
}

export function verifyCipher(encoded_cipher: ArrayBuffer, uid: string) {
  console.log("🚀 ~ file: CryptoCipher.ts ~ line 23 ~ verifyCipher ~ uid", uid)
  const cipher = Buffer.from(encoded_cipher);

  let cipher_version_buffer = cipher.slice(0, 1);
  console.log("🚀 ~ file: CryptoCipher.ts ~ line 27 ~ verifyCipher ~ cipher_version_buffer", cipher_version_buffer)
  let random_buffer = cipher.slice(1, 8);
  console.log("🚀 ~ file: CryptoCipher.ts ~ line 29 ~ verifyCipher ~ random_buffer", random_buffer)
  let signature = cipher.slice(8);
  console.log("🚀 ~ file: CryptoCipher.ts ~ line 31 ~ verifyCipher ~ signature", signature)

  let uid_buffer = Buffer.from(uid, 'hex');
  let sign_buffer = Buffer.concat([random_buffer, uid_buffer]);
  const asn1sig = concatSigToAsn1Sig(signature);

  const verify = crypto.crypto.createVerify('sha256');
  verify.update(sign_buffer);
  return verify.verify(PUBKEY, Buffer.from(asn1sig, 'hex'));
}

// const CYPHER = 'AWknqGONJuUXV7YeD25Lp5FliPZpQHoBMCE5jVlGCVUh3HLmuhjhJAUaTGIILtDU';
// let id = '0444A7EAA86481';

// console.log("##########################################################################################################################################",verifyCipher(CYPHER, id))

