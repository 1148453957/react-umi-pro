import { base_info, geAccessToken, homeUrl, initRBIData } from '@/api/base';
import localManage from '@/assets/js/loacalUtils';
import { XalContext } from '@/utils/xal/XalContext';
import ta from 'thinkingdata-browser';
import gravityEngine from './gravityEngine.esm.min';

export let ge: any;
// 打点
export const sendRBI = (
  type:
    | 'XALEX_SHOW'
    | 'XALEX_CLICK'
    | 'XALEX_IAP_PAY_SHOW'
    | 'XALEX_IAP_PAY_CLICK'
    | string,
  params = {},
) => {
  try {
    ta.track(type, params);
  } catch (error) {
    console.log('error: ', error);
  }
};
export const initRBI = () => {
  try {
    XalContext.init(
      base_info.packageName,
      base_info.versionCode,
      base_info.versionName,
      homeUrl,
    );
    let uuid = XalContext.getClientId();
    sessionStorage.setItem('onlyId', uuid);
    base_info.clientId = uuid;
    ta.init({
      appId: initRBIData.appId,
      serverUrl: initRBIData.serverUrl,
      autoTrack: {
        pageShow: false,
        pageHide: false,
      },
      showLog: false,
    });

    if (!localManage.getHasAlresdyPrint()) {
      ta.identify(uuid);
      sendRBI('XWEB_ACTIVATE', {});
      localManage.setHasAlresdyPrint();
    }

    ge = gravityEngine;

    ge.init({
      autoTrack: {
        pageShow: true,
        pageHide: true,
      },
      mode: 'none', //TODO none
      showLog: true,
      accessToken: geAccessToken, // 项目通行证，在：网站后台-->管理中心-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
      clientId: uuid, // 用户唯一标识，如果不传，就用sdk生成的uuid代替
    });
  } catch (error) {
    console.log('error: ', error);
  }
};
