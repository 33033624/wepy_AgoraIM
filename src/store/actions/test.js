import {createAction} from 'redux-actions'
import {PRICE} from '../types'
export const stepListener = createAction(PRICE, ({type, payload}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        type,
        ...payload
      })
    }, 500)
  })
})
