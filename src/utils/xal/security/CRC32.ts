/**
 * 封装CRC32数据压缩加密的工具类
 * author: 三方
 * quoter：zhougejie
 */
export const CRC32 = (str: string) => {
    const Utf8Encode = function (s: string) {
      s = s.replace(/\r\n/g, '\n')
      let text = ''
      for (let n = 0; n < s.length; n++) {
        const c = s.charCodeAt(n)
        if (c < 128) {
          text += String.fromCharCode(c)
        } else if (c > 127 && c < 2048) {
          text += String.fromCharCode((c >> 6) | 192)
          text += String.fromCharCode((c & 63) | 128)
        } else {
          text += String.fromCharCode((c >> 12) | 224)
          text += String.fromCharCode(((c >> 6) & 63) | 128)
          text += String.fromCharCode((c & 63) | 128)
        }
      }
      return text
    } 
  
    const makeCRCTable = function () {
      let c
      const crcTable = []
      for (let n = 0; n < 256; n++) {
        c = n
        for (let k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        }
        crcTable[n] = c
      }
      return crcTable
    }
  
    const crcTable = makeCRCTable()
    const strUTF8 = Utf8Encode(str)
    let crc = 0 ^ -1
    for (let i = 0; i < strUTF8.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ strUTF8.charCodeAt(i)) & 0xff]
    }
    crc = (crc ^ -1) >>> 0
    return crc
  }