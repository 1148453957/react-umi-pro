import { CRC32 } from '../../security/CRC32'
import { AppletInfoHelper } from './AppletInfoHelper'
import { XalConfig } from '../XalConfig'
import { XalDebuger } from '../util/XalDebuger'

/**
 * ClientId获取与生成的工具类
 * author: zhougejie
 */
export class ClientIdHelper {
  static TAG: string = 'ClientIdHelper'

  static clientId: string = ''
  static cidKey: string = 'xal_cid'

  static getClientId(): string {
    // 优先返回内存态
    if (this.clientId != '') {
      XalDebuger.logWithTag(
        this.TAG,
        'get ClientId from memory: ' + this.clientId
      )
      return this.clientId
    }
    // 从持久化文件读取
    let cidStore: string = localStorage.getItem(this.cidKey)
    if (cidStore != null && cidStore != '') {
      this.clientId = cidStore
      XalDebuger.logWithTag(
        this.TAG,
        'get ClientId from storage: ' + this.clientId
      )
      return this.clientId
    }
    // 生成新的ClientId
    this.clientId = this.generateXalClientId()
    return this.clientId
  }

  /**
   * ClientId生成规则（定长32位）
   * UUID(随机串)：10字节
   * 协议：1字节，目前为1
   * 平台：1字节（android/ios/win/web/applet），小程序为5
   * 生成CID的应用版本号：3字节 （版本号的36进制，取最后3位，不够用0补齐该字段）
   * 生成CID时间：8字节 （时间戳的36进制转换）
   * 包名：7字节（包名crc32的，36进制转换）
   * 补位或截断
   */
  static generateXalClientId(): string {
    let xalClientId: string = ''
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789'
    // UUID前置位(随机串)
    let UUID: string = ''
    for (let i = 0; i < 10; i++) {
      UUID += inOptions.charAt(Math.floor(Math.random() * inOptions.length))
    }
    xalClientId += UUID
    XalDebuger.logWithTag(this.TAG, 'UUID: ' + UUID)

    // 协议：1字节，
    let protocolVersion: string = '1'
    xalClientId += protocolVersion
    XalDebuger.logWithTag(this.TAG, 'protocolVersion: ' + protocolVersion)

    // 平台：1字节
    let platformType: string = '5'
    xalClientId += platformType
    XalDebuger.logWithTag(this.TAG, 'platformType: ' + platformType)

    // 生成CID的应用版本号：保证一定凑齐3字节，版本号永远取最后3位
    let versionCode36Radix: string =
      '000' + AppletInfoHelper.getVersionCode().toString(36)
    let versionCodeLength: number = versionCode36Radix.length
    versionCode36Radix = versionCode36Radix.substring(
      versionCodeLength - 3,
      versionCodeLength
    )
    xalClientId += versionCode36Radix
    XalDebuger.logWithTag(this.TAG, 'versionCode36Radix: ' + versionCode36Radix)

    // 生成ClientId的时间戳，8位
    let generateTime: number = new Date().getTime()
    let generateTime36Radix: string = generateTime.toString(36)
    xalClientId += generateTime36Radix
    XalDebuger.logWithTag(
      this.TAG,
      'generateTime: ' +
        generateTime +
        ', generateTime36Radix: ' +
        generateTime36Radix
    )

    // 包名crc32值，再进行36进制的转换
    let packageName: string = AppletInfoHelper.getPackageName()
    if (packageName == '' || packageName == null) {
      packageName = 'N/A'
    }
    let crc32Value: number = CRC32(packageName)
    let pkgNameCrc32Value36Radix: string = crc32Value.toString(36)
    xalClientId += pkgNameCrc32Value36Radix
    XalDebuger.logWithTag(
      this.TAG,
      'pkgNameCrc32Value36Radix: ' + pkgNameCrc32Value36Radix
    )

    // 补位或截断
    let idLength: number = xalClientId.length
    XalDebuger.logWithTag(this.TAG, 'current length: ' + idLength)
    if (idLength < 32) {
      let suffixStr: string = '0000000000000000' + generateTime
      let suffixStrLength: number = suffixStr.length
      let strStart: number = suffixStrLength - 32 + idLength
      let suffix: string = suffixStr.substring(strStart, suffixStrLength)
      xalClientId += suffix
      XalDebuger.logWithTag(
        this.TAG,
        'less than 32 digits, append ' +
          (32 - idLength) +
          ' digits. suffix: ' +
          suffix
      )
    } else if (idLength > 32) {
      xalClientId = xalClientId.substring(0, 32)
      XalDebuger.logWithTag(this.TAG, 'more than 32 digits, truncation.')
    } else {
      XalDebuger.logWithTag(this.TAG, '32 digits.')
    }
    // 持久化到文件中
    localStorage.setItem(this.cidKey, xalClientId)

    XalDebuger.logWithTag(
      this.TAG,
      'get ClientId from generate: ' + xalClientId
    )
    return xalClientId
  }
}
