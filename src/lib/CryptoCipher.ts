import { Buffer } from 'buffer'

const crypto = require('../../crypto')
const asn1 = require('asn1.js');
const BN = require('bn.js');
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

export function verifyCipher(encoded_cipher: string, uid: string) {
  const cipher = Buffer.from(encoded_cipher, 'base64');

  let cipher_version_buffer = cipher.slice(0, 1);
  let random_buffer = cipher.slice(1, 8);
  let signature = cipher.slice(8);

  let uid_buffer = Buffer.from(uid, 'hex');
  let sign_buffer = Buffer.concat([random_buffer, uid_buffer]);
  const asn1sig = concatSigToAsn1Sig(signature);

  const verify = crypto.createVerify('sha256');
  verify.update(sign_buffer);
  return verify.verify(PUBKEY, Buffer.from(asn1sig, 'hex'));
}

// const CYPHER = 'AWknqGONJuUXV7YeD25Lp5FliPZpQHoBMCE5jVlGCVUh3HLmuhjhJAUaTGIILtDU';
// let id = '0444A7EAA86481';

// console.log("##########################################################################################################################################",verifyCipher(CYPHER, id))

