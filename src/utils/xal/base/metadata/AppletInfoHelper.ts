/**
 * 小程序相关重要字段的工具类
 * author: zhougejie
 */
export class AppletInfoHelper {

    static packageName: string;
    static versionCode: number;
    static versionName: string;
    static domainName: string;

    static setPackageName(packageName: string): void {
        this.packageName = packageName;
    }

    static setVersionCode(versionCode: number): void {
        this.versionCode = versionCode;
    }

    static setVersionName(versionName: string): void {
        this.versionName = versionName;
    }

    static setDomainName(domainName: string): void {
        this.domainName = domainName;
    }

    static getPackageName(): string {
        return this.packageName;
    }

    static getVersionCode(): number {
        return this.versionCode;
    }

    static getVersionName(): string {
        return this.versionName;
    }

    static getDomainName(): string {
        return this.domainName;
    }


}