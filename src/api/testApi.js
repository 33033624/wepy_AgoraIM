import Http from '@/utils/Http.js'
const testApi = () => {
  return Http.get('https://aqcx.lnch-tech.com/mini_program/wx/user/login', {}, true)
}
export default testApi
