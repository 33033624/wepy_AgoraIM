import wepy from 'wepy'
import Tips from '../utils/Tips'

// HTTP工具类
export default class Http {
  static async request (method, url, data, loading = false) {
    const param = {
      url: url,
      method: method,
      data: data
    }
    if (loading) {
      Tips.loading();
    }
    console.info(`[http]request url=${url}`)
    const res = await wepy.request(param)
    Tips.loaded()
    if (this.isSuccess(res)) {
      return res.data.data
    } else {
      throw this.requestException(res)
    }
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
    return !(wxData && wxData.code !== 0)
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
}
