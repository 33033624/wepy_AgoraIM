<template>
<view class=" agora-bg">
  <view class="content flex-center-column">
    <view class="logo-section flex-center-column">
      <image class="logo" style="width: 300rpx; height: 200rpx;" mode="aspectFit" src="../../images/logo.png"></image>
      <text class="h1">声网小程序实时消息</text>
    </view>
    <view class="form-section flex-center-column">
      <view class="inputWrapper">
        <input placeholder-style='color:#A3D1E0' class="channelInput" placeholder='account Name' 
        @input="onInputAccount"
         >
        </input>
      </view>
      <view class="inputWrapper">
        <input placeholder-style='color:#A3D1E0' class="channelInput" placeholder='optional token' 
          @input="onInputToken" value="{{token}}">
        </input>
      </view>
      <button plain="true" @tap="login" class="loginBtn">Login</button>
    </view>
    <view class="footer flex-center-column">
      <text>Powered by Agora. Build v1.0.0</text>
    </view>
  </view>
</view>
</template>
<script>
import wepy from 'wepy'
const RTMClient = require("../../utils/agora-rtm.js");
const { debounce } = require("../../utils/util.js");
export default class Index extends wepy.page {
   data =  {
      token: undefined,
      accountName: "",
   }
   onLoad () {
     console.log(wepy.$instance.globalData, 'flobaldata ==>>>')
    this.rtm = new RTMClient();
    // sdk连接状态
    this.rtm.on("ConnectionStateChanged", (newState, reason) => {
      console.log("The connection status", newState);
      console.log("The reason for the state change", reason);
    });
    //rtm 赋值给全局
    wepy.$instance.globalData.agoraRtm = this.rtm;
  }
    bindLogin () {
    if (!this.data.accountName) {
      console.log("accountName is null");
      if (this.rtm.isLogin) {
        console.log("already login");
        return;
      }
      return;
    }
    console.log(this.data, "data==>>>>");
    this.rtm
      .login(this.token, this.accountName)
      .then(() => {
        console.log("login success");
        this.rtm.isLogin = true;
        wx.navigateTo({
          url: `/pages/im/channel`,
        });
      })
      .catch((err) => {
        console.log("login failed", err);
      });
  }
   methods = {
    login () {
    return debounce(this.bindLogin(), 500);
    },



  onInputToken (e) {
    console.log(e, 'e==>>>')
    this.setData({
      token: e.detail.value,
    });
  },

  onInputAccount (e) {
    console.log(e, 'e==>>>>')
    this.accountName = e.detail.value
  },
   }
}
</script>
<style lang='scss'>
@import "../../styles/common.wxss";

.content {
  position: absolute;
  left: 80rpx;
  right: 80rpx;
  width: auto;
  height: 100%;
}

.content .logo-section .logo{
  margin-bottom: 20rpx;
}

.content .logo-section .h1{
  margin-bottom: 150rpx;
}

.content .form-section{
  width: 100%;
}

.content .inputWrapper{
  width: 100%;
  border-radius: 20rpx;
  margin-top: 16rpx;
  background-color: rgba(255,255,255,0.4);
  border: 1px solid #98BECA;
}

.account {
  height: 80rpx;
  
}
.content .channelInput{
  font-size: 28rpx;
  padding: 0 30rpx;
  height: 80rpx;
  color: #5083AA;
}

.content .loginBtn{
  background-color: #FEFFFE;
  color: #5083AA;
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  margin-top: 32rpx;
  line-height: 80rpx;
  box-shadow: 0px 4px 4px rgba(84,163,186,0.15);  
  font-weight: bold;
  border: 0; 
}

.content .envBtn{
  /* background-color: white; */
  color: white;
  height: 80rpx;
  font-size: 28rpx;
  margin-top: 32rpx;
  line-height: 80rpx;
  border: 0;
  margin-bottom: -10rpx;
}

.content .footer{
  justify-content: flex-end;
  flex-grow: 1;
  font-size: 24rpx;
  margin-bottom: 32rpx;
  color: #63C5E6;
}

.agora-user {
  display: flex;
}


</style>