# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)


本地开发连测试接口

1. 修改本地host 127.0.0.1 landing.sibenz.cn
2. 本地地址 http://landing.sibenz.cn/
或者是novel-landing.zzpeishuang.com


- 测试地址：
- https://landing.sibenz.cn/novellandingh5/index.html#/
- 正式地址：
- https://novel-landing.zzpeishuang.com/novellandingh5/index.html#/


## 登录相关
1. 匿名登录直接返回了cookie
2. 手机号登录在获取验证码时，cookie就返回了，而不是在输入验证码进行校验的时候
3. 业务接口根据cookie去账号系统查询，没有登录或者cookie过期等问题出现，查询不到账户，都会统一返回```{code: 601,message: "session check error"}```
4. 所以如果点了手机号登录，但是又没有去输入验证码，cookie被替换了，就会出错，需要收到重新匿名登录给替换回来
5. userid存在cookie，多页签共享，没有设置过期时间，所以浏览器一关就清空了，只要关了浏览器再次进来就会重新匿名登录  
6. 如果没有关浏览器，就会去调用接口



## 微信支付相关

1. 是否直接跳转过去  
   oppo 自带浏览器会先跳转微信链接再跳转回来（手机端）  
   但是 chrome 浏览器会直接出弹窗，但是地址没有进行跳转（手机端）  
   pc 上的 chrome 浏览器会先跳转微信链接再跳转回来（pc 端）

2. 跳转微信后再重定向回来
   - 如果出现了弹窗，但是点击取消没有去支付，相当于多了一个 recharge 网页，回退会回到充值前的 recharge（手机端）
   - 如果出现了弹窗，点击到了微信，然后取消支付，也是相当于多了一个 recharge 网页，回退会回到充值前的 recharge（手机端）
   - 如果出现了弹窗，点击到了微信，然后成功支付，就不多，相当于直接替换了当前的这个网页，然后直接可以回退到跳进 recharge 前的网页，不知道为啥，很离谱
   - 所以解决办法就是自己跳进充值页面前，自己本地记录一下当前的路由，然后不用 `router.back()`，但是挡不住用户自己手动回退
