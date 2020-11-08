# 十八周

## 1. 实现一个线上 Web 服务｜初始化 server

本课程中使用虚拟机代替服务器进行演示，相关 vm 可在课程页面下载。

我自己有 vps，本节内容就不做笔记了。

## 2. 实现一个线上 Web 服务｜利用 Express，编写服务器（一）

使用脚手架创建 express 服务器目录

```bash
npx express-generator
npm install
```

课程中 winter 将案例做成了一个完全的静态服务器。

## 3. 实现一个线上 Web 服务｜利用 Express，编写服务器（二）

通过 scp 命令将本地文件复制到远程服务器。我个人习惯通过 git 来同步文件，winter 建议为了保证一致性而使用复制的方法。

## 4. 实现一个发布系统｜用 node 启动一个简单的 server

```javascript
// server.js
const http = require('http')

http.createServer((req, res) => {
  res.end('Hello world')
}).listen(8082)
```

## 5. 实现一个发布系统｜编写简单的发送请求功能

```javascript
// publish.js
const http = require('http')

const request = http.request({
  hostname: '127.0.0.1',
  port: 8082
}, res => {
  console.log(res)
})

request.end()
```

## 6. 实现一个发布系统｜简单了解 Node.js 的流

[Node.js stream 文档](https://nodejs.org/api/stream.html#stream_class_stream_readable)

流的方式便于大文件处理。

```javascript
// server.js
const http = require('http')

http.createServer((req, res) => {
  console.log(req.headers)
  req.on('data', chunk => {
    console.log(chunk.toString())
  })
  req.on('end', chunk => {
    res.end('success')
  })
}).listen(8082)

// publish.js
const http = require('http')

const fs = require('fs')

const request = http.request({
  hostname: '127.0.0.1',
  port: 8082,
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream'
  }
}, res => {
  console.log(res)
})

const file = fs.createReadStream('./package.json')

file.on('data', chunk => {
  request.write(chunk)
})

file.on('end', () => {
  request.end()
})
```

## 7. 实现一个发布系统｜改造 server

```javascript
const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  const outFile = fs.createWriteStream('../server/public/sample.json')
  req.on('data', chunk => {
    outFile.write(chunk)
  })
  req.on('end', chunk => {
    outFile.end()
    res.end('success')
  })
}).listen(8082)
```

## 8. 实现一个发布系统｜实现多文件发布

通过压缩的方式实现多文件发布，分别使用两个 npm 包，archiver（压缩）、unzipper（解压），详见各自的文档。

通过 `readable.pipe(destination[, options])` 来简化流的操作。

```javascript
// publish.js
const file = fs.createReadStream('./package.json')

// file.on('data', chunk => {
//   request.write(chunk)
// })

file.pipe(request)

file.on('end', () => {
  request.end()
})

// server.js
let outFile = fs.createWriteStream('../server/public/sample.json')
// req.on('data', chunk => {
//   outFile.write(chunk)
// })
// req.on('end', chunk => {
//   outFile.end()
//   res.end('success')
// })
req.pipe(outFile)
```

压缩上传：

```javascript
// publish.js
const http = require('http')
const archiver = require('archiver')

const request = http.request({
  hostname: '127.0.0.1',
  port: 8082,
  method: 'POST',
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
```

服务端接收解压：

```javascript
const http = require('http')
const unzipper = require('unzipper')

http.createServer((req, res) => {
  console.log('request')
  req.pipe(unzipper.Extract({ path: '../server/public/' }))
}).listen(8082)
```

要知道文件的大小可以通过 `fs.stats(path, callback)` API。

```javascript
// publish.js
const http = require('http')
const fs = require('fs')

fs.stat('./package.json', (err, stats) => {
  const request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size
    }
  }, res => {
    console.log(res)
  })
  
  const file = fs.createReadStream('./package.json')
  
  file.pipe(request)
  
  file.on('end', () => request.end())
})
```

## 9. 实现一个发布系统｜用 Github oAuth 做一个登录实例

Github oAuth App，[文档](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps)。

1. 打开 https://github.com/login/oauth/authorize，点击授权后会自动跳转到在 github app 中预设好的你的网站的 oAuth 页面，比如 `localhost:8082/auth`。
2. `/auth` 路由接收 code，用 code + client_id + client_secret 换 token
3. 创建 server，接收 token，后点击发布
4.  `/publish` 路由用 token 获取用户信息，检查权限，接收发布

```javascript
// publish.js
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

// server.js
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
```