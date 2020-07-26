let express = require('express')

let app = express()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", '*')
  if(req.method === 'OPTIONS') {
    return res.send()
  }
  next()
})

app.get('/getTreeList', (req, res) => {
  res.json({
    code: 0,
    parent: [
      {label: '文件夹1', pid: 0, id: 1},
      {label: '文件夹2', pid: 0, id: 2},
      {label: '文件夹3', pid: 0, id: 3},
      {label: '文件夹1-1', pid: 1, id: 4},
      {label: '文件夹2-1', pid: 2, id: 5},
    ],
    children: [
      {label: '文件1', pid: 1, id: 10001},
      {label: '文件2', pid: 1, id: 10002},
      {label: '文件2-1', pid: 2, id: 10003},
      {label: '文件1-1-1', pid: 4, id: 10004},
      {label: '文件2-1-1', pid: 5, id: 10005},
    ]
  })
})

app.listen(3000, () => {
  console.log('serve is running')
})