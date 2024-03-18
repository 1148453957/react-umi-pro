import { http } from './base'
/**任务接口域名 */
const taskDomain =process.env.UMI_APP_TASK_HOST

/**获取任务列表 */
export function getTaskInfo(data: any) {
  return http({
    url: `${taskDomain}/promotion/home`,
    method: 'post',
    data,
  })
}

/**任务上报 */
export function relationTask(data: any) {
  return http({
    url: `${taskDomain}/promotion/relation_task`,
    method: 'post',
    data,
  })
}
