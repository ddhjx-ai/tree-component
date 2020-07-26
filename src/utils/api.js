import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export const getList = () => {
  return axios.get('/getTreeList')
}