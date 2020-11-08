const http = require('http')
const https = require('https')
const unzipper = require('unzipper')
const querystring = require('querystring')

function auth(req, res) {
  const query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1])
  getToken(query.code, info => {
    res.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`)
    res.end()
  })
}

function getToken(code, callback) {
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=your_client_id&client_secret=your_client_secret`,
    port: 443,
    method: 'POST'
  }, function(response) {
    let body = ''
    response.on('data', chunk => {
      body += chunk.toString()
    })
    response.on('end', () => {
      callback(querystring.parse(body))
    })
  })
  request.end()
}

function publish(req, res) {
  const query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1])
  getUser(query.token, info => {
    if (info.login === 'your name') {
      req.pipe(unzipper.Extract({ path: '../server/public/' }))
      req.on('end', () => {
        res.end('success!')
      })
    }
  })
}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: '/user',
    port: 443,
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'your_github_app_name'
    }
  }, response => {
    let body = ''
    response.on('data', chunk => {
      body += chunk.toString()
    })
    response.on('end', () => {
      callback(JSON.parse(body))
    })
  })
}

http.createServer((req, res) => {
  if (req.url.match(/^\/auth\?/)) {
    return auth(req, res)
  }
  if (req.url.match(/^\/pulblish\?/)) {
    return publish(req, res)
  }
}).listen(8082)