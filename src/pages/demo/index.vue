<template>
    <view>
      <view class="page__bd">
        <mp-cells ext-class="my-cells" >
            <mp-cell>
                <view>数量</view>
                <view slot="footer">
                  <button class="decrease" size="mini" @tap="descrese">-</button>
                  <input class="input-number" value="{{count}}" @input="inputCount" />
                  <button class="add" size="mini" @tap="add">+</button>
                </view>
            </mp-cell>
            <mp-cell>
                <view>金额</view>
                <view slot="footer">￥{{price}}</view>
            </mp-cell>
        </mp-cells>
      </view>
    </view>
</template>
<script>
import wepy from 'wepy'
import { connect } from 'wepy-redux'
import { PRICE } from '@/store/types'
import { stepListener } from '@/store/actions'
import testApi from '@/api/testApi'
  @connect({
    price(state) {
      return state.test.price
    },
    count (state) {
      return state.test.count
    }
  })
export default class Index extends wepy.page {
  onLoad () {
    testApi().then(res => {
      console.log(res, 'res==>>')
    }).catch(e => {
      console.log(e, 'e==>>')
    })
    wepy.setNavigationBarTitle({
      title: 'weui+redux实现的demo'
    })
  }
  methods = {
    inputCount ({detail: {value}}) {
      const judge = typeof Number(value)
      if (judge === 'number') {
        wepy.$store.dispatch(stepListener({
          payload: {
            count: Number(value)
          }
        }))
      }
    },
    descrese () {
      console.log(wepy)
      wepy.$store.dispatch({
        type: PRICE,
        payload: {
          count: this.count - 1
        }
      })
    },
    add () {
      wepy.$store.dispatch({
        type: PRICE,
        payload: {
          count: this.count + 1
        }
      })
    }
  }
  config = {
    usingComponents: {
      'mp-cells': '../../weui/cells/cells',
      'mp-cell': '../../weui/cell/cell'
    }
  }
}
</script>
<style lang="scss">
.add, .decrease, .input-number{
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.input-number{
  width: 50px;
  border-bottom: 1px solid #000;
  text-align: center;
}
</style>
