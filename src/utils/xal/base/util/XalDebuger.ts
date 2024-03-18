import { XalConfig } from "../XalConfig";

/**
 * XAL日志输出器
 * author: zhougejie
 */
export class XalDebuger {

    static defaultTag: string = "[xal]";

    static log(content: string): void {
        if (XalConfig.DEBUG) {
            console.log(this.defaultTag + " " + content);
        }
    }

    static logWithTag(tag:string, content: string): void {
        if (XalConfig.DEBUG) {
            console.log(this.defaultTag + "["+ tag + "] " + content);
        }
    }

}