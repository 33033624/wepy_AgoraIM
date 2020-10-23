# wepy+AgoraIM

### 安装环境

```
# 安装（更新） wepy 命令行工具。
cnpm install wepy-cli -g
# 安装依赖包
cnpm install
# 开发实时编译。
npm run dev
```

### 声网 im 集成到 wepy 使用方法

- APPID 配置

  ```javascript
  // ./scr/utils/config.js
  const APPID = ""; // APPID 为声网APPID
  if (APPID === "") {
    wx.showToast({
      title: `请在config.js中提供正确的appid`,
      icon: "none",
      duration: 5000,
    });
  }

  module.exports = {
    APPID: APPID,
  };
  ```

  - 集成 api 调用

    - 初始化

      ```javascript
      // sdk引入
      const RTMClient = require("../../utils/agora-rtm.js");
      // 创建客户单实例
      this.rtm = new RTMClient();
      // 监听sdk连接状态
      this.rtm.on("ConnectionStateChanged", (newState, reason) => {
        console.log("The connection status", newState);
        console.log("The reason for the state change", reason);
      });
      // 将实例挂载到全局globalData 上
      wepy.$instance.globalData.agoraRtm = this.rtm;
      ```

    - 登录

      ```javascript
      /* @params
       * token 是服务器通过 appid appCertificate 两个参数来获取的。具体可参考https://docs.agora.io/cn/Real-time-Messaging/token_server_rtm
       * accountName 是前端自己输入的 没有限制
       */
      this.rtm
        .login(token, accountName)
        .then(() => {
          console.log("im登录成功");
        })
        .catch((err) => {
          console.log("im登录失败", err);
        });
      ```

      - 加入房间 创建房间

      ```javascript
      /* @params
       * channelName 房间名称
       */
      this.rtm
        .joinChannel(channelName)
        .then(() => {
          console.log("加入成功");
        })
        .catch((err) => {
          console.log("加入失败", err);
        });
      ```

      - 离开房间

      ```javascript
      /* @params
       * channelName 房间名称
       */
      this.rtm
        .leaveChannel()
        .then(() => {
          console.log("leave success");
        })
        .catch((err) => {
          console.log("leave failed", err);
        });
      ```

      - 获取成员列表

      ```javascript
      this.rtm
        .getMembers()
        .then((members) => {
          console.log("成员列表为：", members);
        })
        .catch((err) => {
          console.log("获取成员列表失败", err);
        });
      ```

      - 在房间内发送消息

      ```javascript
      /* @params
       * channelMessage 消息
       */
      this.rtm
        .sendChannel(channelMessage)
        .then(() => {
          console.log("send channel meaasge success");
        })
        .catch((err) => {
          console.log("send channel meaasge failed", err);
        });
      ```

      - 监听

      ```javascript
      // 监听频道消息
      this.rtm.on("ChannelMessage", (message, memberId) => {
        let object = {
          uid: memberId, // 成员名称||id
          message: message.text, // 消息内容
        };
      });
      //监听频道成员进入
      this.rtm.on("MemberJoined", (memberId) => {
        console.log("进入成员memberId: ", memberId);
      });
      // 监听频道成员退出
      this.rtm.on("MemberLeft", (memberId) => {
        console.log("退出人员memberId为: ", memberId);
      });
      ```

### 小程序工具

- 使用微信开发者工具-->添加项目，选择 dist 目录；
- 可以使用体验 APPID；
- 关闭 ES6 转 ES5；
- 关闭上传代码时样式自动补；
- 关闭代码压缩上传；
- 打开不校验合法域名；

### 参考文档

> [WePY 开发文档参考](https://tencent.github.io/wepy/)

> [声网 im 文档](https://docs.agora.io/cn/Real-time-Messaging/product_rtm?platform=All%20Platforms)

> [声网 im 服务端 token 生成](https://docs.agora.io/cn/Real-time-Messaging/token_server_rtm)

> [weui 小程序组件文档参考](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)

> [wepy-redux 文档参考](https://www.npmjs.com/package/wepy-redux)
