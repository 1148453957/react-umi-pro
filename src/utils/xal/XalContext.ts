import { XalConfig } from "./base/XalConfig";
import { AppletInfoHelper } from "./base/metadata/AppletInfoHelper";
import { ClientIdHelper } from "./base/metadata/ClientIdHelper";
import { XalDebuger } from "./base/util/XalDebuger";

/**
 * Xal对外输出API的门面类
 * author: zhougejie
 */
export class XalContext {

    /**
     * XAL小程序公共库的初始化
     * @param packageName 小程序的包名
     * @param versionCode 小程序的版本号
     * @param versionCode 小程序的版本名称
     * @param domainName 预留字段，后续小程序基础服务分域名时，会用到，先传''。
     */
    static init(packageName: string, versionCode: number, versionName: string, 
        domainName: string): void {
        XalDebuger.log("init start");
        // 重要参数的传参。
        AppletInfoHelper.setPackageName(packageName);
        AppletInfoHelper.setVersionCode(versionCode);
        AppletInfoHelper.setVersionName(versionName);
        AppletInfoHelper.setDomainName(domainName);
        // 预加载ClientId。
        ClientIdHelper.getClientId();
        XalDebuger.log("init end");
    }

    static enableDebug() {
        XalConfig.DEBUG = true;
    }

    /**
     * 获取ClientId（APUS标识的用户唯一ID）
     */
    static getClientId():string {
        return ClientIdHelper.getClientId();
    }


}