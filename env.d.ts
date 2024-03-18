/// <reference types="vite/client" />
interface Window {
  
}

interface ImportMetaEnv {
  readonly UMI_APP_RUN_ENV: 'local' | 'test' | 'prod'
  readonly env: {
    readonly [key: string]: string | boolean | undefined;
    // 你可以继续添加你的环境变量的具体类型定义
    // 例如：
    // readonly UMI_APP_APP_API_URL: string;
  };
}



declare module 'qs'
declare module 'thinkingdata-browser'
declare module 'js-cookie'
declare module 'array.prototype.at'

