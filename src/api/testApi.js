import Http from '@/utils/Http.js'
const testApi = () => {
  return Http.get('/testapi', {}, true)
}
const miniprogramLogin = (params) => {
  return Http.post('/login', params, true)
}
export {
  testApi,
  miniprogramLogin
}
