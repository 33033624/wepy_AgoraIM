import {handleActions} from 'redux-actions'
import {INIT, PRICE} from '../types/test'

const defaultState = {
  count: 1,
  price: 50
}

export default handleActions({
  [INIT](state) { // 初始化
    return {...state, ...defaultState}
  },
  [PRICE](state, action) { // 修改数量和价格
    const price = defaultState['price'] * action.payload['count']
    return {...state, ...action.payload, price}
  }
}, defaultState)
