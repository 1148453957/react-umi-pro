import md5 from 'md5'
import { gzip, ungzip } from 'pako'
import { enc, DES, mode, pad } from 'crypto-js'

export const getUrlParam = (name: string) => {
  // 从第一个?开始，截取到最后一个#/
  let arr = location.href.split('?')
  let str = arr.slice(1).join('?')
  arr = str.split('#/')
  if (arr.length > 1) {
    str = arr.slice(0, -1).join('#/')
  }
  const searchParams = new URLSearchParams(str)
  return searchParams.get(name) ?? ''
}

//转换md5
export function getDataMd5(bytes: any) {
  try {
    const md6 = md5(bytes)
    return md6
  } catch (error) {
    return null
  }
}

//获取上传签名
export function getSignatureButter(params: any) {
  const sortedKeys = Object.keys(params).sort()
  let builder = ''

  for (const key of sortedKeys) {
    builder += key + '=' + params[key]
  }

  builder += '1q2w3e4r5t6y7u8i9o0p'

  return getDataMd5(builder)
}

// 压缩
export const gzipSource = (params: any) => {
  const source = gzip(JSON.stringify(params), {
    level: 9,
    raw: true,
  })

  const array = new Int8Array([
    (source.length >> 8) & 0xff,
    source.length & 0xff,
  ])
  const buffer = new Int8Array(array.length + source.length)

  buffer.set(array, 0)
  buffer.set(source, array.length)

  return buffer.buffer
}

// 解压
export const ungzipSource = (params: any) => {
  const result = ungzip(params as ArrayBuffer, {
    to: 'string',
    raw: true,
  })

  return JSON.parse(result)
}
/**
 * 校验归因渠道
 * @param clickCompany
 */
export const isNature = (clickCompany: any) => {
  console.log('current clickCompany:' + clickCompany)
  return !clickCompany || clickCompany === 'natural'
}
/**文件下载 */
export function resourceDownload(FilePath: string, FileName?: string) {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = FilePath
  link.download = FileName || ''
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
/**文件下载，如果是跨域的 */
export function resourceDownloadNew(FilePath: string, FileName?: string) {
  fetch(FilePath).then((res) =>
    res.blob().then((blob) => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = FileName || ''
      a.click()
      window.URL.revokeObjectURL(url)
    })
  )
}

/**des加密,用于任务相关接口传参 */
export function encryptData(base_info: { [key: string]: any }) {
  let secretkey = 'a#p$u^s&'
  let arr = []
  for (const key in base_info) {
    arr.push(`${key}=${base_info[key]}`)
  }
  const dataWordArray = enc.Utf8.parse(arr.join('&'))
  const encrypted = DES.encrypt(dataWordArray, enc.Utf8.parse(secretkey), {
    mode: mode.ECB, // DES 使用 ECB 模式
    padding: pad.Pkcs7, // 使用 PKCS7 填充
  })
  return encodeURIComponent(encrypted.toString().replaceAll(' ', '+'))
}
