# 十七周｜工具链

## 1. 单元测试工具｜Mocha（一）

[Mocha](https://mochajs.org/)

简单应用：

```javascript
// add.js
function add(a, b) {
  return a + b
}

module.exports = add

// test.js
var assert = require('assert')
var add = require('../add')

describe('add function testing', function () {
  it('1 + 2 should be 3', function() {
    assert.strictEqual(add(1, 2), 3)
  })

  it('-5 + 2 should be -3', function() {
    assert.strictEqual(add(-5, 2), -3)
  })
})
```

## 2. 单元测试工具｜Mocha（二）

如果不想用 `module.export`，想用 `export`，可以引入 babel。

```bash
npm install -D @babel/core @babel/register @@babel/preset-env

./node_modules/.bin/mocha --require @babel/register
```

配置 babel

```json
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

添加到 package.json 的 npm 命令里：

```json
"scripts": {
  "test": "mocha --require @babel/register"
}
```

默认会调用项目里的 mocha，可以省略 `./node_modules/.bin/`

## 3. 单元测试工具｜code coverage

引入一个新工具 nyc

```bash
npm i -D nyc babel-plugin-istanbul @istanbuljs/nyc-config-babel
```

将 babel 和 nyc 关联起来：

```json
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["istanbul"]
}

// .nycrc
{
  "extends": "@istanbuljs/nyc-config-babel"
}
```

运行：

```bash
./node_modules/.bin/nyc npm run test
```

## 4. 单元测试工具｜对 html-parser 进行单元测试

```json
// .vscode
"runtimeArgs": ["--require", "@babel/register"],
"sourceMaps": true

// .babelrc
"sourceMaps": "inline"
```

一般来说单元测试的方法覆盖率 100%，行覆盖率 90% 以上就是合理的。

## 5. 单元测试工具｜所有工具与 generator 的集成

见 [./generator-toytool](./generator-toytool)