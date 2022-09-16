import { verifyCipher } from './CryptoCipher'
import { DefaultApi } from './api';
import { Buffer } from 'buffer'
import type { Product, Result } from './types';

async function validateCipher(id: string, records: NDEFRecord[]): Promise<Result> {
    var api = new DefaultApi();
    const cypher1Valid = verifyCipher(records[1].data!.buffer, id)
    const cypher2Valid = verifyCipher(records[2].data!.buffer, id)

    var onlineValid = false
    let p1 = api.tagUidGet({ readOnly: true, uid: id as any, cipher: Buffer.from(records[1].data!.buffer).toString("base64") });
    let p2 = api.tagUidGet({ readOnly: true, uid: id as any, cipher: Buffer.from(records[2].data!.buffer).toString("base64") });
    var product: Product | undefined = undefined;
    try {
        product = (await p2) as any;
        console.log("🚀 ~ file: NFC.ts ~ line 17 ~ validateCipher ~ product", product)

        onlineValid = true;
    } catch (error) {
        try {
            product = (await p1) as any;
            console.log("🚀 ~ file: NFC.ts ~ line 22 ~ validateCipher ~ product", product)
            onlineValid = true;
        } catch (error) {

        }
    }


    return {
        tagInfo: {
            offlineCheck: cypher1Valid || cypher2Valid,
            onlineCheck: Boolean(onlineValid),
            uid: id,
            xiphooTag: cypher1Valid || cypher2Valid
        },
        product: product
    };
}

export async function Read() {
    try {
        const ndef = new NDEFReader();
        await ndef.scan();


        return new Promise((resolve, reject) => {
            const listener = async (tag: Event) => {
                console.log("NFC: Read tag:", tag)
                try {
                    //@ts-ignore
                    let uid = tag.serialNumber.replace(/:/g, "")
                    // Type5 tags have 8 byte UID with last constant byte 
                    // Thus we must crop the UID to fit in database 
                    if (uid.length > 14) {
                        uid = uid.slice(0, 14)
                    }
                    console.log("NFC: normalized uid =", uid)
                    //@ts-ignore
                    const res = await validateCipher(uid, tag.message.records)
                    resolve(res);
                } catch (error) {
                    reject(error)
                } finally {
                    ndef.removeEventListener("reading", listener)
                }
            }

            const errorListener =  () => {
                alert("Argh! Cannot read data from the NFC tag. Try another one?");
                ndef.removeEventListener("readingerror", errorListener)
            }

            ndef.addEventListener("readingerror", errorListener);
            ndef.addEventListener("reading", listener);
        })

    } catch (error) {
        alert("Argh! " + error);
    }
}
