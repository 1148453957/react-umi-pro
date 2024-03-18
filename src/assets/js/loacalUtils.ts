/**
 * 保存归因结果
 * @param click_company
 */
const setClickCompanyStorage = (click_company: any) => {
  localStorage.setItem('click_company', click_company)
}

/**
 * 获取归因结果
 */
const getClickCompanyStorage = () => {
  return localStorage.getItem('click_company')
}

/**
 * 保存账号id信息
 * @param advertiser_id
 */
const setAdvertiserId = (advertiser_id: any) => {
  localStorage.setItem('advertiser_id', advertiser_id)
}

/**
 * 获取账号id信息
 */
const getAdvertiserId = () => {
  return localStorage.getItem('advertiser_id')
}

/**
 *   存走过归因逻辑
 */
const setIsEnterAttribution = () => {
  localStorage.setItem('is_enter_attribution', '1')
}

/**
 *  获取是否走过归因
 */
const getIsEnterAttribution = () => {
  return localStorage.getItem('is_enter_attribution') == '1'
}

/**已經打過點，就不打了 */
function setHasAlresdyPrint() {
  localStorage.setItem('has_alresdy_print', '1')
}

/**已經打過點，就不打了 */
function getHasAlresdyPrint() {
  return localStorage.getItem('has_alresdy_print') === '1'
}

const localManage = {
  setClickCompanyStorage,
  getClickCompanyStorage,
  setAdvertiserId,
  getAdvertiserId,
  setIsEnterAttribution,
  getIsEnterAttribution,
  setHasAlresdyPrint,
  getHasAlresdyPrint,
}

export default localManage
