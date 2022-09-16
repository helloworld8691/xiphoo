
import { ISO15693Tag } from "./ISO15693Tag";
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import { ISO15693 } from "./protocols/ISO15693";
import { ISO15693OperatorInterface } from "./operators/ISO15693OperatorInterface";

// This is a generic Slix Tag implementation as base for Slix2 and SlixS
// It mostly contains OEM specific authorisation implementation which is the same for Slix2/Slix3 

export class ICODESlixTag extends ISO15693Tag {

    public static MANUFACTURER = 0x04
    public static TYPE = 0x00

    public static UNPROTECTED_PAGE_COUNT = 8

    constructor(tag: TagEvent | null, operator: ISO15693OperatorInterface) {
        super(tag, operator)
        this.supportsPasswordProtection = true
    }

    name(): string {
        return "ICODE Slix (ISO 15693)"
    }

    userDataSizeInBlocks() : number {
        return 0 // this class should never be used for particular tag
    }

    async initialize() {
        if (this.supportsPasswordProtection) {
            console.log("NFC", "Pseudo-authenticate with default password")
            const DEFAULT_PASSWORD: [number, number, number, number] = [0, 0, 0, 0]
            let authResultWrite = await this.authenticateForWriting(DEFAULT_PASSWORD)
            let authResultRead = await this.authenticateForReading(DEFAULT_PASSWORD)
            let protectResult = false
            if (authResultWrite && authResultRead) {
                let index = this.userDataSizeInBlocks() - 1 /* last page reserved for counters*/ - ICODESlixTag.UNPROTECTED_PAGE_COUNT
                protectResult = await this.protectPagesBelow(index) 
            }
            return authResultWrite && authResultRead && protectResult
        } else {
            console.log("NFC", "Skip authentication init as password is not protected")
            return true
        }
     }

     async authenticateForWriting(password: [number, number, number, number]) {
         return await this.authenticate(password, ICODESlixTag.PASSWORD_IDENTIFIER_WRITE)
     }

    private async authenticateForReading(password: [number, number, number, number]) {
        return await this.authenticate(password, ICODESlixTag.PASSWORD_IDENTIFIER_READ)
    }

    private async authenticate(password: [number, number, number, number], passwordIdentifier: number) {
        try {

            console.log("NFC", "Select")
            await this.operator.select(this.uidAs64BitNumber())
            console.log("NFC", "Select done")

            console.log("NFC", "Get random number")
            var resp = await this.operator.invokeCustomCommand(
                ISO15693.FLAG_DATA_RATE_HIGH,
                ICODESlixTag.CMD_GET_RANDOM_NUMBER, 
                ICODESlixTag.MANUFACTURER_CODE,
                [])
    
            if (!ISO15693Tag.isError(resp)) {
                console.log("NFC", "SUCCESS ", resp[1], resp[2])
                const rn1 = resp[1]
                const rn2 = resp[2]
                const encodedPassword = this.encodePassword(password, [rn1, rn2])

                console.log("NFC", "Set password")
                var resp = await this.operator.invokeCustomCommand(
                    // we use FLAG_SELECTED_MODE and not addressed mode 
                    // because on iOS it was not possible to achieve proper command execution
                    // in address mode, seems that addressed mode is broken in CoreNFC 
                    // (at least for the commands which contain data and not only command id)
                    ISO15693.FLAG_SELECTED_MODE | ISO15693.FLAG_DATA_RATE_HIGH,
                    ICODESlixTag.CMD_SET_PASSWORD, ICODESlixTag.MANUFACTURER_CODE, 
                    [passwordIdentifier,
                ...encodedPassword]) 
    
                if (!ISO15693Tag.isError(resp)) {
                    console.log("NFC", "SUCCESS ")
                    return true
                } else {
                    console.log("NFC", "Set password FAILED")
                }
            
            } else {
                console.log("NFC", "Get random number FAILED")
            }
        }
        catch (exception) {
            console.log("NFC", "Exception", exception)
        }    
    
        return false 
    }

    encodePassword(password: [number, number, number, number], xor: [number, number]) : [number, number, number, number] {
        return [password[0] ^ xor[0], password[1] ^ xor[1], password[2] ^ xor[0], password[3] ^ xor[1]]
    }

    // Note that precondition for setPassword is being already authenticated with the old password
    // This is valid also for the initial state where default password is 00000000
    async setPasswordForWriting(password: [number, number, number, number]) {
        console.log("NFC", "Write password")
        var resp = await this.operator.invokeCustomCommand(
            ISO15693.FLAG_ADDRESS_MODE,
            ICODESlixTag.CMD_WRITE_PASSWORD,
            ICODESlixTag.MANUFACTURER_CODE,  
            [...this.uidAs64BitNumber(), // using ADDRESS_MODE requires specifying UID in command
            ICODESlixTag.PASSWORD_IDENTIFIER_WRITE,
        ...password])

        if (!ISO15693Tag.isError(resp)) {
            console.log("NFC", "SUCCESS ")
            return true
        } else {
            console.log("NFC", "Write password FAILED")
        }
        return false 
    }

    async protectPagesBelow(pageIndex: number) {
        // TODO: it would make sense to add address valudation
        console.log("NFC", "Protecting pages below", this.UInt8(pageIndex))
        if (this.UInt8(pageIndex) < this.userDataSizeInBlocks()) {
            var resp = await this.operator.invokeCustomCommand(
                ISO15693.FLAG_ADDRESS_MODE,
                ICODESlixTag.CMD_PROTECT_PAGE, 
                ICODESlixTag.MANUFACTURER_CODE,
                [...this.uidAs64BitNumber(), // using ADDRESS_MODE requires specifying UID in command
                this.UInt8(pageIndex),
                ICODESlixTag.FLAG_STATUS_WRITE_PROTECTED_PAGE_L
                ])
            if (!ISO15693Tag.isError(resp)) {
                console.log("NFC", "SUCCESS ")
                return true
            }
        } 
        return false
    }

    static CMD_GET_RANDOM_NUMBER: number = 0xB2
    static CMD_SET_PASSWORD: number = 0xB3
    static CMD_WRITE_PASSWORD: number = 0xB4
    static CMD_PROTECT_PAGE: number = 0xB6

    static MANUFACTURER_CODE: number = 0x04 
    static PASSWORD_IDENTIFIER_READ: number = 0x01
    static PASSWORD_IDENTIFIER_WRITE: number = 0x02

    static FLAG_STATUS_READ_PROTECTED_PAGE_H: number = 0b00010000
    static FLAG_STATUS_WRITE_PROTECTED_PAGE_H: number = 0b00100000
    static FLAG_STATUS_READ_PROTECTED_PAGE_L: number = 0b00000001
    static FLAG_STATUS_WRITE_PROTECTED_PAGE_L: number = 0b00000010

}