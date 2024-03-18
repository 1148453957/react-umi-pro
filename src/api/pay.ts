import { gzipSource } from '@/assets/js/utils'
import md5 from 'md5'
import { appId, base_info, http } from './base'
import Cookies from 'js-cookie'

/**支付接口域名 */
const payDomian =process.env.UMI_APP_PAY_HOST

/**获取商品列表 */
export const getGoodsList = async (data: any) => {
  console.log('getGoodsList 请求参数 ', {
    base_info,
    appId,
    ...data,
  })
  return await http({
    url: `${payDomian}/stream/v2/goods`,
    method: 'post',
    responseType: 'arraybuffer',
    data: gzipSource({
      base_info,
      appId,
      ...data,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/octet-stream;charset=UTF-8',
      // debug: 'true',
    },
  })
}
// 权益购买(需要sign验签)
// 加密字段：appId =& channelId=& goodsId=& userId=& timestamp=
export const payOrder = async (data: any) => {
  const param = {
    appId,
    channelId: '46',
    timestamp: Date.now(),
    goodsId: data.goodsId,
    userId: data.userId,
  }
  const signature = getSignature(param)
  console.log('权益购买 请求参数 ', {
    signature,
    baseParam: base_info,
    equityVersion: data.equityVersion,
    ...param,
  })
  return await http({
    url: `${payDomian}/stream/v2/buy`,
    method: 'post',
    responseType: 'arraybuffer',
    data: gzipSource({
      signature,
      baseParam: base_info,
      equityVersion: data.equityVersion,
      ...param,
    }),
    headers: {
      'Content-type': 'application/octet-stream;charset=UTF-8',
      // debug: 'true',
    },
  })
}
// 是否有权益
export const hasEquities = async (data: any) => {
  const param = {
    appId,
    timestamp: Date.now(),
    equityId: data.equityId,
    equityName: data.equityName,
    userId: data.userId,
  }
  const signature = getSignature(param)
  console.log('hasEquities param: ', param)
  return await http({
    url: `${payDomian}/stream/v4/has`,
    method: 'post',
    responseType: 'arraybuffer',
    data: gzipSource({
      signature,
      base_info,
      ...param,
    }),
    headers: {
      'Content-type': 'application/octet-stream;charset=UTF-8',
      // debug: 'true',
    },
  })
}
// sign验签
const getSignature = (param = {}) => {
  type DataKeys = keyof typeof param
  const keys = Object.keys(param).sort() as DataKeys[]
  const signArr: string[] = []
  keys.forEach((key) => {
    const val = param[key]
    if (val !== undefined) {
      signArr.push(`${key}=${param[key]}`)
    }
  })
  return md5(signArr.join('') + '1q2w3e4r5t6y7u8i9o0p')
}

/**消耗权益 */
export const reduceEquities = async (data: any) => {
  const param = {
    appId,
    timestamp: Date.now(),
    equityId: data.equityId,
    equityName: data.equityName,
    userId: data.userId,
  }
  const signature = getSignature(param)
  console.log('reduceEquities param: ', param)
  return await http({
    url: `${payDomian}/stream/reduce/times`,
    method: 'post',
    data: {
      signature,
      base_info,
      ...param,
      changeTimes: 1,
    },
    headers: {
      'Content-Type': 'application/json',

      debug: 1,
      defalt: 'false',
      // debug: 'true',
    },
  })
}

/**兑换码兑换权益 */
export const exchangeEquities = async (data: any) => {
  const param = {
    redemptionCode: data.redemptionCode,

    appId,
    timestamp: Date.now(),

    userId: data.userId,
  }
  const signature = getSignature(param)
  console.log('兑换码兑换权益，/stream/apply/equity', {
    signature,
    base_info,
    ...param,
  })

  return await http({
    url: `${payDomian}/stream/apply/equity`,
    method: 'post',
    responseType: 'arraybuffer',

    data: gzipSource({
      signature,
      base_info,
      ...param,
    }),
    headers: {
      'Content-type': 'application/octet-stream;charset=UTF-8',

      // debug: 'true',
    },
  })
}

/**时间类型权益，判断用户是否已经使用过兑换码 */
export const hasExchanged = async (data: any) => {
  const param = {
    appId,
    timestamp: Date.now(),
    equityId: data.equityId,
  }
  const signature = getSignature(param)
  return await http({
    url: `${payDomian}/stream/v3/has/${Cookies.get('userId')}`,
    method: 'post',
    responseType: 'arraybuffer',
    data: {
      ...param,
      signature,
      base_info,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
