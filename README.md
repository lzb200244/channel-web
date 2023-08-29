# Easy-Channel



<center>
    <img src="./assets/chat.png" alt="chat" style="width:40%;" />

## 畅 聊
![Build Status](https://img.shields.io/badge/build-passing-green.svg)
![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-yellow.svg)
![License](https://img.shields.io/badge/license-GPL3.0-blue.svg)

</center>

### 引言
> 该项目是用于2023年秋季的毕设。基于drf+vue3以及相关技术栈开发。
> 支持群聊、私聊、@GPT等功能，探索并实现基于websocket协议的即时通讯系统。
> 熟悉一些常见设计模式与架构思想等。

## 技术选型

### 后端

| **技术**        | **说明**                                         | **官网**                                                    |
| --------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| Django          | web开发必备框架                                  | https://www.djangoproject.com/                              |
| Drf             | 使用Django Rest Framework更好地支持RESTful API。 | https://q1mi.github.io/Django-REST-framework-documentation/ |
| Channels        | 使用Channels支持WebSocket连接。                  | https://channels.readthedocs.io/en/latest/                  |
| Rabbitmq        | 处理异步任务                                     | https://www.rabbitmq.com/                                   |
| Redis           | 缓存加速，多数据结构支持业务功能                 | [https://redis.io](https://redis.io/)                       |
| Nginx           | 负载均衡，https配置，websocket升级，ip频控       | [https://nginx.org](https://nginx.org/)                     |
| Docker          | 应用容器引擎                                     | [https://www.docker.com](https://www.docker.com/)           |
| 腾讯cos         | 对象存储                                         | https://cloud.tencent.com/product/cos                       |
| Jwt             | 用户登录，认证方案                               | [https://jwt.io](https://jwt.io/)                           |
| GPT（文心一言） | 支持Ai回复                                       | https://yiyan.baidu.com/                                    |
| Swagger-UI      | API文档生成工具                                  | https://github.com/swagger-api/swagger-ui                   |

### 前端

| **技术**      | **说明**                                        | **官网**                                              |
| ------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Vue3          | 前端流行开发框架                                | [https://cn.vuejs.org](https://cn.vuejs.org/)         |
| Pinia         | vue3 官方推荐状态管理框架                       | [https://pinia.vuejs.org](https://pinia.vuejs.org/)   |
| Vue-router    | Vue 的官方路由                                  | [https://router.vuejs.org](https://router.vuejs.org/) |
| TypeScript    | 让 JS 具备类型声明                              | https://www.typescriptlang.org/                       |
| Ant Design v3 | 基于 vue3 的组件库                              | https://3x.antdv.com/components/overview-cn           |
| Axios         | Axios 使用简单,包尺寸小且提供了易于扩展的接口。 | https://www.axios-http.cn/                            |
| Vite          | 极速的前端打包构建工具                          | [https://cn.vitejs.dev](https://cn.vitejs.dev/)       |
| Pnpm          | 速度快、节省磁盘空间的软件包管理器              | [https://www.pnpm.cn](https://www.pnpm.cn/)           |

## 项目地址

[前端地址]()

[后端地址](https://github.com/lzb200244/easychannel-back/tree/dev)

## 实现功能

```markdown

- 多环境发布
  - dev
  - prod
  
- 全局功能
  - Svg Sprite 图标
  - 自适应收缩侧边栏
  
- 编辑器
  - 富文本
  - Markdown
  
- 错误页面
  - 404
  
- 用户
  - 登录 / 注销
  - 头像上传
  - 更新账户
  - 关注与粉丝
  - 个人成就
  - ... 

- 聊天
  - 发消息
  	- 文本
  	- 表情
  	- 文件、图片
  - @（艾特） 
  - @ AI
  - 撤回
  - 点赞
  - 历史聊天记录
  - 图片、文件
  - 创建群聊/加入群聊
  - 用户上下状态线推送
  - 附近的人
  - ... 

```





## 构建

---

### 方式1



### 方式2



## 更多

- [开发文档](https://note.youdao.com/s/2o2RLOit)
