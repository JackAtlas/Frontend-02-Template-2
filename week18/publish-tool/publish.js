const http = require('http')
const archiver = require('archiver')
const child_process = require('child_process')
const querystring = require('querystring')

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=your_client_id`)

http.createServer((req, res) => {
  const query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1])
  publish(query.token)
}).listen(8083)

function publish(token) {
  const request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    path: `/publish?token=${token}`,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }, res => {
    console.log(res)
  })
  
  const archive = archiver('zip', {
    zlib: { level: 9 }
  })
  
  archive.directory('./sample', false)
  archive.finalize()
  archive.pipe(request)
}