import { http } from './base'
/**小说接口域名 */
const apiDomain =process.env.UMI_APP_API_HOST

/**获取小说详情，获取目录 */
export function getNovelDetail(data: any) {
  return http({
    url: `${apiDomain}/novel/detail`,
    method: 'post',
    data,
   timeout:30000
  })
}
/**获取小说内容 */
export function getNovelContent(url: string) {
  return http({
    url,
    method: 'get',
    responseType: 'text',
    withCredentials: false,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
/** 推荐小说列表*/
export function getCommendNovelList(data: any) {
  return http({
    url: `${apiDomain}/novel/queryRecomBookShelf`,
    method: 'post',
    data,
  })
}
/** 推荐小说列表，改为人气*/
export function getCommendNovelListInstead(data: any) {
  return http({
    url: `${apiDomain}/novel/home`,
    method: 'post',
    data,
  })
}

/** 获取书架列表*/
export function getNovelList(data: any) {
  return http({
    url: `${apiDomain}/novel/bookShelf/list`,
    method: 'post',
    data,
  })
}

/** 保存书架列表*/
export function saveNovelList(data: any) {
  return http({
    url: `${apiDomain}/novel/bookShelf/batchSave`,
    method: 'post',
    data,
  })
}

/** 获取用户信息*/
export function getUserInfo(data: any) {
  return http({
    url: `${apiDomain}/innovation/points/getBalance`,
    method: 'post',
    data,
  })
}
/** 充值订单记录*/
export function getCommodityRecord(data: any) {
  return http({
    url: `${apiDomain}/innovation/points/getCommodityRecord`,
    method: 'post',
    data,
  })
}
/** 积分获取记录（充值+任务）*/
export function getPointsLogRecord(data: any) {
  return http({
    url: `${apiDomain}/innovation/points/getPointsLogRecord`,
    method: 'post',
    data,
  })
}

/** 积分消耗记录*/
export function getSpendRecord(data: any) {
  return http({
    url: `${apiDomain}/innovation/points/spendRecord`,
    method: 'post',
    data,
  })
}

/** 消耗书币*/
export function spendCoin(data: any) {
  return http({
    url: `${apiDomain}/innovation/points/spend`,
    method: 'post',
    data,
  })
}

/**章节阅读记录 */
export function chapterSave(data: any) {
  return http({
    url: `${apiDomain}/reading/chapterSave`,
    method: 'post',
    data,
  })
}

/**阅读时间记录 */
export function timeSave(data: any) {
  return http({
    url: `${apiDomain}/reading/timeSave`,
    method: 'post',
    data,
  })
}

/**获取视频列表 */
export function getVideoList(data: any) {
  return http({
    url: `${apiDomain}/novel/video/list`,
    method: 'post',
    data,
  })
}
