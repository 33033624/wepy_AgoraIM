<style lang="scss">
@import "./styles/weui/weui.wxss";
</style>
<script>
import wepy from "wepy";
import "wepy-async-function";
import "./store/index.js";
export default class extends wepy.app {
  globalData = {
    agoraRtm: null,
  };
  constructor() {
    super();
    // 注册中间件
    this.use("requestfix");
    this.use("promisify");
  }
  onLaunch(param) {}
  config = {
    pages: ["pages/im/login", "pages/im/channel"],
    window: {
      backgroundTextStyle: "dark",
      backgroundColor: "#F5F5F5",
      navigationBarBackgroundColor: "#1296db",
      navigationBarTitleText: "wepy+weui+redux脚手架",
    },
  };
}
</script>
