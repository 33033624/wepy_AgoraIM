import wepy from 'wepy'
import Tips from '../utils/Tips'
import { miniprogramLogin } from '@/api/testApi'
const baseUrl = 'https://test.com'
// HTTP工具类
export default class Http {
  static async request (method, url, data, loading = false) {
    const param = {
      url: baseUrl + url,
      method: method,
      data: data,
      header: {
        'X-Access-Token': wepy.getStorageSync('accessToken')
      }
    }
    if (loading) {
      Tips.loading();
    }
    console.info(`[http]request url=${url}`)
    const res = await wepy.request(param)
    Tips.loaded()
    if (this.isSuccess(res)) {
      return res.data
    } else {
      throw this.requestException(res)
    }
  }
  /**
   * 带登录态请求
   */
  static async requestWithLogin (method, url, data, loading = false) {
    let token = wepy.getStorageSync('accessToken')
    if (!token) {
      await Http.login()
    }
    const param = {
      url: baseUrl + url,
      method: method,
      data: data,
      header: {
        'X-Access-Token': wepy.getStorageSync('accessToken')
      }
    }
    if (loading) {
      Tips.loading();
    }
    const res = await wepy.request(param)
    Tips.loaded()
    if (this.isSuccess(res)) {
      return res.data
    } else {
      console.log(res, 'resdata')
      const { message, status } = res['data']
      if (status == '500' && message.indexOf('Token失效') > -1) {
        await Http.login()
        return await Http.requestWithLogin(method, url, data, loading)
      } else {
        throw this.requestException(res)
      }
    }
  }
  /**
   * 获取登录信息
   */
  static async login () {
    const { code } = await wepy.login()
    const res = await miniprogramLogin({code})
    Http.setLoginStorage(res['result'])
    console.log(2)
  }
  /**
   * 判断请求是否成功
   */
  static setLoginStorage (result) {
    const {accessToken, photoUrl, nickname, userInfo} = result
    accessToken && wepy.setStorageSync('accessToken', accessToken)
    photoUrl && wepy.setStorageSync('photoUrl', photoUrl)
    nickname && wepy.setStorageSync('nickname', nickname)
    userInfo && wepy.setStorageSync('userInfo', userInfo)
  }
  /**
   * 判断请求是否成功
   */
  static isSuccess (res) {
    const wxCode = res.statusCode
    // 微信请求错误
    if (wxCode !== 200) {
      return false
    }
    const wxData = res.data
    if (wxData.hasOwnProperty('code')) {
      return !(wxData && wxData.code !== 200)
    }
    return true
  }
  /**
   * 异常
   */
  static requestException (res) {
    var error = {}
    Object.assign(error, res['data'])
    return error
  }
  static get (url, data, loading = true) {
    return Http.request('GET', url, data, loading)
  }
  static put (url, data, loading = true) {
    return Http.request('PUT', url, data, loading)
  }
  static post (url, data, loading = true) {
    return Http.request('POST', url, data, loading)
  }
  static patch (url, data, loading = true) {
    return Http.request('PATCH', url, data, loading)
  }
  static delete (url, data, loading = true) {
    return Http.request('DELETE', url, data, loading)
  }
  static getWithLogin (url, data, loading = true) {
    return Http.requestWithLogin('GET', url, data, loading)
  }
  static putWithLogin (url, data, loading = true) {
    return Http.requestWithLogin('PUT', url, data, loading)
  }
  static postWithLogin (url, data, loading = true) {
    return Http.requestWithLogin('POST', url, data, loading)
  }
  static patchWithLogin (url, data, loading = true) {
    return Http.requestWithLogin('PATCH', url, data, loading)
  }
  static deleteWithLogin (url, data, loading = true) {
    return Http.requestWithLogin('DELETE', url, data, loading)
  }
}
