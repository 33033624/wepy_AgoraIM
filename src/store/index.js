import { createStore, applyMiddleware } from 'redux'
import { setStore } from 'wepy-redux'
import promiseMiddleware from 'redux-promise'
import wepy from 'wepy'
import reducers from './reducers'
import {INIT} from './types'
const store = createStore(reducers, applyMiddleware(promiseMiddleware))
wepy.$store = store
setStore(store)

export default store.dispatch({type: INIT})
