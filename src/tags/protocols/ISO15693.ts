
export class ISO15693 {

    static FLAG_DATA_RATE_HIGH:     number = 0b00000010
    static FLAG_OPTION_FLAG_WRITE:  number = 0b01000000
    static FLAG_ADDRESS_MODE:       number = 0b00100000
    static FLAG_SELECTED_MODE:      number = 0b00010000

    static FLAG_ERROR: number = 0x01

    static CMD_WRITE_SINGLE_BLOCK: number = 0x21
    static CMD_SELECT: number = 0x25

    static CC_MAGIC_BYTE = 0xE1
    static CC_VERSION = 0x40
}