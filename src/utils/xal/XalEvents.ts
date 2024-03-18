
/**
 * 满足Xal标准规范的事件库
 * 目前由于没有自研的打点库，所以事件库只是用于规范输出，并不进行防御编码检测。
 * author: zhougejie
 */
const XalEvents = {
    
    /**
     *  激活事件，表示新用户激活。
     *  触发时机：在小程序/H5的首次loading页启动后，进行打点。
     */
    XWEB_ACTIVATE: "XWEB_ACTIVATE", 
    XWEB_ACTIVATE_NAME: "name", // 类型string。
    XWEB_ACTIVATE_REASON: "reason", // 类型string，保留字段，暂不使用。

    /**
     *  心跳事件，表示用户发生了进程启动，代表在后台存活。
     *  触发时机：在小程序/H5的进程启动后，进行打点。
     */
    XWEB_HEARTBEAT: "XWEB_HEARTBEAT",
    XWEB_HEARTBEAT_NAME: "name", // 类型string，默认传值为process_start，代表进程启动。

    /**
     *  打开任意页面事件，表示用户打开了小程序/H5。
     *  触发时机：在小程序/H5的首个UI页面展示后，进行打点。
     */
    XWEB_STARTUP: "XWEB_STARTUP",
    XWEB_STARTUP_NAME: "name", // 类型string，无默认传值，可以传当前的页面名称。

    /**
     *  打开主页事件，在小程序/H5的主页展示后，进行打点。
     *  触发时机：表示用户展示了小程序/H5的主页。(从详情页回到主页也打点)
     */
    XWEB_MAIN_INTERFACE: "XWEB_MAIN_INTERFACE",
    XWEB_MAIN_INTERFACE_NAME: "name", // 类型string，无默认传值，可以传当前的页面名称。
        
    /**
     *  页面展示事件，记录页面展示和停留了多久。(用于统计单页面时长和整体应用使用时长)
     *  触发时机：当离开任意页面时，记录该页面的展示和停留时长。
     */
    XWEB_PAGE_VIEW: "XWEB_PAGE_VIEW",
    XWEB_PAGE_VIEW_NAME: "name", // 类型string，无默认传值，可以传当前的页面名称。
    XWEB_PAGE_VIEW_DURATION: "duration", // 类型number，记录页面停留时长，单位为毫秒。
    
    /**
     *  通用展示事件，用于记录页面、组件、弹窗等可见元素的展示动作。
     *  触发时机：产品自定义。
     */    
    XWEB_SHOW: "XWEB_SHOW",
    XWEB_SHOW_NAME: "name", // 类型string，展示名称。
    XWEB_SHOW_TYPE: "type", // 类型string，展示类型。
    XWEB_SHOW_CONTAINER: "container", // 类型string，所在父容器/父页面的名称。
    XWEB_SHOW_FROM_SOURCE: "from_source", // 类型string，来源。
    XWEB_SHOW_FLAG: "flag", // 类型string，标记。
    XWEB_SHOW_TEXT: "text", // 类型string，文案描述。
    XWEB_SHOW_DURATION: "duration", // 类型number，展示时长。
    XWEB_SHOW_RESULT_CODE: "result_code", // 类型string，结果。

    /**
     *  通用点击事件，用于记录页面、组件、弹窗等可见元素的点击动作。
     *  触发时机：产品自定义。
     */    
    XWEB_CLICK: "XWEB_CLICK",  
    XWEB_CLICK_NAME: "name", // 类型string，点击名称。
    XWEB_CLICK_TYPE: "type", // 类型string，点击类型。
    XWEB_CLICK_CONTAINER: "container", // 类型string，所在父容器/父页面的名称。
    XWEB_CLICK_FROM_SOURCE: "from_source", // 类型string，来源。
    XWEB_CLICK_FLAG: "flag", // 类型string，标记。
    XWEB_CLICK_TEXT: "text", // 类型string，文案描述。
    XWEB_CLICK_DURATION: "duration", // 类型number，时长。
    XWEB_CLICK_RESULT_CODE: "result_code", // 类型string，结果。

    /**
     *  通用操作事件，用于记录任意行为的操作。
     *  触发时机：产品自定义。
     */    
    XWEB_OPERATION: "XWEB_OPERATION",
    XWEB_OPERATION_NAME: "name", // 类型string，操作名称。
    XWEB_OPERATION_TYPE: "type", // 类型string，操作类型。
    XWEB_OPERATION_CONTAINER: "container", // 类型string，所在父容器/父页面的名称。
    XWEB_OPERATION_FROM_SOURCE: "from_source", // 类型string，来源。
    XWEB_OPERATION_FLAG: "flag", // 类型string，标记。
    XWEB_OPERATION_TEXT: "text", // 类型string，文案描述。
    XWEB_OPERATION_DURATION: "duration", // 类型number，时长。
    XWEB_OPERATION_RESULT_CODE: "result_code", // 类型string，结果。

    /**
     *  内购请求事件，记录内购页面的请求行为。
     *  触发时机：记录内购页面的请求行为。
     */ 
    XWEB_IAP_PAY_REQUEST: "XWEB_IAP_PAY_REQUEST",

    /**
     *  内购展示事件，记录内购页面的展示行为。
     *  触发时机：记录内购页面的展示行为。
     */ 
    XWEB_IAP_PAY_SHOW: "XWEB_IAP_PAY_SHOW",
 
    /**
     *  内购点击事件，记录内购页面的点击行为。
     *  触发时机：记录内购页面的点击行为。
     */ 
    XWEB_IAP_PAY_CLICK: "XWEB_IAP_PAY_CLICK",
    
    /**
     *  通用操作事件，用于记录任意行为的操作。
     *  触发时机：产品自定义。
     */ 
    XWEB_IAP_PAYMENT: "XWEB_IAP_PAYMENT",
    

}


export default XalEvents;