<template>
<view class="agora-box">
  <!-- <view class="swiper-tab">
    <view class="swiper-tab-list {{currentTab===0 ? 'on' : ''}}" data-current="0" @tap="swichNav">Channel</view>
  </view> -->
  <scroll-view class="message-box" scroll-y scroll-into-view="{{bottom}}">
    <view wx:if="{{showMsg}}" class="msg-box">
      {{msgDetails}}
    </view>
    <view wx:if="{{currentTab === 0}}" >
      <view wx:if="{{queryMembers}}">
        当前频道用户: {{channelMembers}}
      </view> 
      <view wx:for="{{channelMessageArray}}" wx:key="index" wx:for-item="channelItem">
        <view>
          uid: {{channelItem.uid}} 
          <view class="mes">
            {{channelItem.message}}
          </view>
        </view>
      </view>
    </view>
    <view wx:if="{{currentTab === 1}}">
      <view wx:for="{{peerMessageArray}}" wx:key="index" wx:for-item="peerItem">
        <view wx:if="{{peerItem.isLocal}}">
          accountName: {{accountName}}
        </view>
        <view wx:else>
          peerId: {{peerItem.peerId}}
        </view>
        <view class="mes mesPeer">
          {{peerItem.message}}
        </view>
      </view>
    </view>
    <view id="scrollBottom">
      
    </view>
  </scroll-view>
  <swiper current="{{currentTab}}" class="swiper-box" duration="300" bindchange="bindChange">
    <swiper-item>
      <view class="operate-box">
        <view class="information-box">
          <view class="input-message">
            <input placeholder-style='color:#A3D1E0' class="shortInput" placeholder='channel name' 
              @input="onChannelName" value="{{channelName}}">
            </input>
          </view>
          <view class="button-box">
            <button wx:if="{{!joinStatus}}" class="mini-btn" @tap="bindJoin" type="default" size="mini">Join</button>
            <button wx:else class="mini-btn" @tap="bindLeave" type="default" size="mini">Leave</button>
            <button class="mini-btn query" @tap="bindQuery" type="default" size="mini">Query</button>
          </view>
        </view>
        <view class="information-box">
          <view class="input-message">
            <input placeholder-style='color:#A3D1E0' class="channelInput" placeholder='channel message' 
              maxlength="-1" @input="onChannelMessage" cursor="1" value="{{channelMessage}}">
            </input>
          </view>
          <view class="button-box">
            <button class="mini-btn" @tap="bindChannelSend" type="default" size="mini">Send</button>
          </view>
        </view>
      </view>
    </swiper-item>
  </swiper>
</view>


</template>
<script>
import wepy from 'wepy'
export default class Channel extends wepy.page {
  data = {
    channelName: '',
    channelMessage: '',
    peerId: '',
    peerMessage: '',
    accountName: '',    
    channelMessageArray: [],
    peerMessageArray: [],
    joinStatus: false,
    bottom: '',
    currentTab: 0,
    channelMembers: [],
    queryMembers: false,
    showMsg: false,
    msgDetails: ''
  }
    onLoad () {
    // 获取全局赋值的 rtm
    this.rtm = wepy.$instance.globalData.agoraRtm
    // 拿到登陆的账户名
    this.setData({
      accountName: this.rtm._accountName
    })
    this.peerOffMsg()
    this.onPeerMsgEvent()
    this.onChannelEvent()
    // sdk连接状态
    this.rtm.on('ConnectionStateChanged', (newState, reason) => {
      console.log('The connection status', newState)
      console.log('The reason for the state change', reason)
    })
  }
    onUnload () {
    // 页面销毁时执行
    if(this.rtm.isLogin) {
      this.rtm.logout().then(() => {
        this.rtm.isLogin = false
        console.log('logout success')
      }).catch((err) => {
        console.log('logout failed', err)
      })
    } 

  }

    // 监听点对点消息
  onPeerMsgEvent() {
    this.rtm.on('MessageFromPeer', (message, peerId, isOfflineMessage) => {
      let object = {
        message: message.text,
        peerId: peerId,
        isLocal: false,
        isOfflineMessage: isOfflineMessage
      }
      this.data.peerMessageArray.push(object)
      this.peerMessageArray= this.data.peerMessageArray 
    })
  }
  onChannelEvent() {
    // 频道消息
    this.rtm.on('ChannelMessage', (message, memberId) => {
      let object = {
        uid: memberId,
        message: message.text
      }    
      this.data.channelMessageArray.push(object)
      this.channelMessageArray= this.data.channelMessageArray
    })
    //频道成员进出通知
    this.rtm.on('MemberJoined', (memberId) => {
      console.log('memberId: ', memberId)
      this.msgBounced(`${memberId} join channel`)
    })
    this.rtm.on('MemberLeft', (memberId) => {
      console.log('memberId: ', memberId)
      this.msgBounced(`${memberId} already left`)
    })
  }

  // 点对点离线消息
  // 从 rtm messageCache 数组中获取缓存的离线消息
  peerOffMsg() {
    this.rtm.messageCache.forEach((item) => {
      item.isLocal = false
      this.data.peerMessageArray.push(item)
    })
    this.peerMessageArray= this.data.peerMessageArray 
  }
  methods =  {
onChannelName (e) {
    this.channelName= e.detail.value
  },

  onChannelMessage (e) {
    this.channelMessage= e.detail.value
  },

  onPeerId (e) {
    this.peerId= e.detail.value
  },

  onPeerMessage (e) {
    this.peerMessage= e.detail.value
  },

  bindJoin () {
    if(!this.data.channelName) {
      wx.showModal({
        title: 'message',
        content: 'Please enter the channel name',
      })
      return
    }
    this.joinStatus= true,
    this.rtm.joinChannel(this.data.channelName).then(() => {
      console.log('join channel success')
    }).catch((err) => {
      console.log('join channel failed', err)
    })
  },

  bindLeave () {
    this.joinStatus= false
    this.rtm.leaveChannel().then(() => {
      console.log('leave success')
    }).catch((err) => {
      console.log('leave failed', err)
    })
  },

  bindQuery() {
    if(!this.data.joinStatus) {
      console.log('Please join the channel')
      return
    }
    this.queryMembers= true
    this.rtm.getMembers().then((members) => {
      console.log('channel members', members)
      this.channelMembers= members
    }).catch((err) => {
      console.log('get members failed', err)
    })
  },

  bindChannelSend () {
    if(!this.data.channelMessage) {
      return
    }
    if(!this.data.joinStatus) {
      wx.showModal({
        title: 'message',
        content: 'Please join the channel',
      })
      return
    }
    this.rtm.sendChannel(this.data.channelMessage).then(() => {
      console.log('send channel meaasge success')
    }).catch((err) => {
      console.log('send channel meaasge failed', err)
    })
    let object = {
      uid: this.rtm._accountName,
      message: this.data.channelMessage
    }
    this.data.channelMessageArray.push(object)
    this.channelMessageArray= this.data.channelMessageArray
    // 控制滚动条在最下方 即显示最新消息, 清空输入框的值
    this.bottom= 'scrollBottom',
      this.channelMessage= ''
  },

  // 默认不将该消息设为离线消息，开启后设置离线消息
  openOffMsg() {
    console.log('open offline message')
    this.rtm.isOff = true
  },

  bindPeerSend () {
    if(!this.data.peerMessage) {
      return
    }
    if(!this.data.peerId) {
      wx.showModal({
        title: 'message',
        content: 'Please enter the peer id',
      })
      return
    }
    
    this.rtm.sendPeer(this.data.peerMessage, this.data.peerId).then((e) => {
      console.log('send peer message success', e)
      if(e.hasPeerReceived) {
        console.log('peer received success')
        this.msgBounced('peer received success')
      } else {
        console.log('peer received failed')
        this.msgBounced('peer received failed')
      }
    }).catch((err) => {
      console.log('send peer message failed', err)
    })
    let object = {
      peerId: this.data.peerId,
      message: this.data.peerMessage, 
      isLocal: true
    }
    this.data.peerMessageArray.push(object)
    this.peerMessageArray = this.data.peerMessageArray
    // 控制滚动条 清空输入框
    this.bottom = 'scrollBottom'
      this.peerMessage =  ''
  },

  //tab切换
  swichNav(e) {
    if( this.data.currentTab === e.target.dataset.current ) {
      return false
    } else {
      this.currentTab = e.target.dataset.current
    }
  },

  bindChange(e) {
    this.currentTab= e.detail.current 
  },

  // 弹窗消息
  msgBounced(details) {
    this.showMsg=  true,
      this.msgDetails=details,
    setTimeout(() => {
      this.showMsg = false
    }, 2000)
  },

  }
};
</script>
<style lang="scss">
.agora-box {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #8FD3F5, #D3FDFF);
  color: #5083AA;
}

#scrollBottom {
  height: 1rpx;
}

.operate-box {
  border-top: 2rpx solid #5083AA;
}

.input-message {
  border-radius: 15rpx;
  background-color: rgba(255,255,255,0.4);
  border: 1px solid #98BECA;
}

.channelInput{
  width: 500rpx;
  font-size: 32rpx;
  padding: 12rpx;
  color: #5083AA;
}

.shortInput {
  width: 280rpx;
  font-size: 32rpx;
  padding: 12rpx;
  color: #5083AA;
}

.information-box {
  display: flex;
  justify-content: space-between;
  margin: 10rpx 15rpx 20rpx 15rpx;
}

.button-box {
  padding-top: 10rpx;
}

.query {
  margin-left: 10rpx;
}

.joinButton {
  margin-right: 20rpx;
}

.message-box {
  height: 75%;
}

.channel-box {
  display: flex;
  justify-content: space-between;
}

.members {
  width: 100%;
  height: 100rpx;
}

.body-view {
  margin-top: 10rpx;
}

.mes {
  border-radius: 10rpx;
  font-size: 35rpx;
  min-height: 65rpx;
  /* display: flex;
  flex-wrap: wrap; */
  min-width: 50rpx;
  max-width: 350rpx;
  /* 控制消息显示换行 */
  word-break: break-all;
  word-wrap: break-word;
  background-color: white;
  padding-left: 10rpx;
  padding-top: 10rpx;
  margin-left: 10rpx;
}

.mesPeer {
  
}

.swiper-tab{
  width: 100%;
  text-align: center;
  line-height: 65rpx;
}

.swiper-tab-list{  
  font-size: 30rpx;
  display: inline-block;
  width: 50%;
  color: #777777;
}

.on { 
  color: #5083AA;
  border-bottom: 3rpx solid #5083AA;
}

.swiper-box{ 
  display: block; 
  height: 200rpx;
}

.msg-box{
  min-width: 280rpx;
  height: 90rpx;
  margin-top: 20rpx;
  margin-right: 10rpx;
  line-height: 90rpx;
  background-color: #8FD3F5;
  opacity: 0.8;
  border-radius: 10rpx;
  z-index: 99;
  visibility: 1;
  float: right;
  padding-left: 5rpx;
}
</style>
