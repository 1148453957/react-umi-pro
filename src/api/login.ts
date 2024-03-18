import { appId, http } from './base'
import qs from 'qs'

/**账号系统域名 */
const accountDomain =process.env.UMI_APP_ACC_HOST
const randomStr = (length = 8) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

/**匿名登录 */
export function login(data: any) {
  return http({
    url: `${accountDomain}/v2/user/register`,
    method: 'post',
    data: qs.stringify({
      ...data,
      account_type: 11,
      app_id: appId,
      cr: randomStr(16),
    }),
  })
}
/**发送手机验证码 */
export function sendPhoneCode(data: any) {
  return http({
    url: `${accountDomain}/v2/user/register`,
    method: 'post',
    data: qs.stringify({
      ...data,
      nationcode: '86',
      account_type: 8,
      clientId:sessionStorage.getItem('onlyId') ,
      androidId:sessionStorage.getItem('onlyId') ,
      app_id: appId,
      cr: randomStr(16),
    }),
  })
}
/**验证手机验证码 */
export function verifyPhoneCode(data: any) {
  return http({
    url: `${accountDomain}/v2/user/verifycode`,
    method: 'post',
    data: qs.stringify({
      ...data,
      account_type: 8,
      clientId:sessionStorage.getItem('onlyId') ,
      androidId:sessionStorage.getItem('onlyId') ,
      app_id: appId,
    }),
  })
}
