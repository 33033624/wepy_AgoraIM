import {createAction} from 'redux-actions'
import {PRICE} from '../types'
export const stepListener = createAction(PRICE, ({payload}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(payload)
    }, 500)
  })
})
