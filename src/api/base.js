import http from '../utils/Http'

export default class base {
  static baseUrl = 'https://www.weixin.qq.com';
  static get = http.get.bind(http);
  static put = http.put.bind(http);
  static post = http.post.bind(http);
  static delete = http.delete.bind(http);
}
