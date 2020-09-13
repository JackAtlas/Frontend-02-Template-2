# 第十周｜编程与算法训练

## 1. 使用LL算法构建AST｜四则运算

> AST：抽象语法树，构建 AST 的过程称为语法分析。

### 四则运算

词法：

- TokenNumber：
  - 1 2 3 4 5 6 7 8 9 0 的组合
- Operator：+、-、*、/之一
- Whitespace：\<SP>
- LineTerminator：\<LF> \<CR>

语法：

```
<Expression>::=
  <AdditiveExpression><EOF>

<AdditiveExpression>::=
  <MultiplicativeExpression>
  <AdditiveExpression><+><MultiplicativeExpression>

<MultiplicativeExpression>::=
  <Number>
  |<MultiplicativeExpression><*><Number>
  |<MultiplicativeExpression></><Number>
```

### LL语法分析

```
<AdditiveExpression>::=
  <MultiplicativeExpression>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>
```

```
<AdditiveExpression>::=
  <Number>
  |<AdditiveExpression><*><Number>
  |<AdditiveExpression></><Number>
  |<AdditiveExpression><+><MultiplicativeExpression>
  |<AdditiveExpression><-><MultiplicativeExpression>
```

## 2. 使用LL算法构建AST｜正则表达式

```javascript
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-']

function tokenize(source) {
  var result = null
  while(true) {
    result = regexp.exec(source)

    if (!result) break

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        console.log(dictionary[i - 1])
      }
    }
    console.log(result)
  }
}

tokenize('1024 + 10 * 25')
```

## 3. 使用LL算法构建AST｜LL词法分析

```javascript
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-']

function tokenize(source) {
  var result = null
  var lastIndex = 0
  while(true) {
    lastIndex = regexp.lastIndex
    result = regexp.exec(source)

    if (!result) break

    if (regexp.lastIndex - lastIndex > result[0].length) break

    let token = {
      type: null,
      value: null
    }

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1]
      }
    }
    token.value = result[0]
    yield token
  }

  yield {
    type: 'EOF'
  }
}

for (let token of tokenize('1024 + 10 * 25')) {
  console.log(token)
}
```

## 4. 使用LL算法构建AST｜LL语法分析（一）

```javascript
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-']

function tokenize(source) {
  var result = null
  var lastIndex = 0
  while(true) {
    lastIndex = regexp.lastIndex
    result = regexp.exec(source)

    if (!result) break

    if (regexp.lastIndex - lastIndex > result[0].length) break

    let token = {
      type: null,
      value: null
    }

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1]
      }
    }
    token.value = result[0]
    yield token
  }

  yield {
    type: 'EOF'
  }
}

let source = []

for (let token of tokenize('10 * 25 / 2')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') source.push(token)
}

function Expression(tokens) {}

function AdditiveExpression(source) {}

function MultiplicativeExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]]
    }
    source[0] = node
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MulplicativeExpression' && source[1] && source[1].type === '*') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MulplicativeExpression' && source[1] && source[1].type === '/') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression') return source[0]

  return MultiplicativeExpression(source)
}
```

## 5. 使用LL算法构建AST｜LL语法分析（二）

```javascript
var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g

var dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-']

function tokenize(source) {
  var result = null
  var lastIndex = 0
  while(true) {
    lastIndex = regexp.lastIndex
    result = regexp.exec(source)

    if (!result) break

    if (regexp.lastIndex - lastIndex > result[0].length) break

    let token = {
      type: null,
      value: null
    }

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1]
      }
    }
    token.value = result[0]
    yield token
  }

  yield {
    type: 'EOF'
  }
}

let source = []

for (let token of tokenize('10 * 25 / 2')) {
  if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') source.push(token)
}

function Expression(tokens) {}

function AdditiveExpression(source) {
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: [source[0]]
    }
    source[0] = node
    return AdditiveExpression(source)
  }

  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
    let node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source)
  }

  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
    let node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source)
  }

  if (source[0].type === 'AdditiveExpression') return source[0]
  
  MultiplicativeExpression(source)
  return AdditiveExpression(source)
}

function MultiplicativeExpression(source) {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]]
    }
    source[0] = node
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MulplicativeExpression' && source[1] && source[1].type === '*') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MulplicativeExpression' && source[1] && source[1].type === '/') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: []
    }
    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source)
  }
  if (source[0].type === 'MultiplicativeExpression') return source[0]

  return MultiplicativeExpression(source)
}
```

## 6. 字符串分析算法｜总论

### 字符串分析算法

- 字典树
  - 大量高重复字符串的存储与分析
- KMP
  - 在长字符串里找模式
- Wildcard
  - 带通配符的字符串模式
- 正则
  - 字符串通用模式匹配
- 状态机
  - 通用的字符串分析
- LL LR
  - 字符串多层级结构分析

## 7. 字符串分析算法｜字典树

查字典的行为可以近似看作一个树型结构。

```javascript
class Trie {
  constructor() {
    this.root = Object.create(null)
  }
  insert(word) {
    let node = this.root
    for (let c of word) {
      if (!node[c]) {
        node[c] = Object.create(null)
      }
      node = node[c]
    }
    if (!('$' in node)) node['$'] = 0
    node['$']++
  }
  most() {
    let max = 0
    let maxWord = null
    let visit = (node, word) => {
      if (node.$ && node.$ > max) {
        max = node.$
        maxWord = word
      }
      for (let p in node) {
        visit(node[p], word + p)
      }
    }
    visit(this.root, '')
    console.log(maxWord)
  }
}

function randomWord(length) {
  var s = ''
  for (let i = 0; i < length; i++) {
    s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0))
  }
  return s
}

let trie = new Trie()

for (let i = 0; i < 100000; i++) {
  trie.insert(randomWord(4))
}
```

## 8. 字符串分析算法｜KMP字符串模式匹配算法

```javascript
function kmp(source, pattern) {
  // 计算 table
  let table = new Array(pattern.length).fill(0)

  {
    let i = 1, j = 0

    while(i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        ++j, ++i
        table[i] = j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          ++i
        }
      }
    }
  }

  // 匹配
  {
    let i = 0, j = 0
    while(i < source.length) {
      if (pattern[j] === source[i]) {
        ++i, ++j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          ++i
        }
      }
      if (j === pattern.length) return true
    }
    return false
  }
}
```

## 9. 字符串分析算法｜Wildcard

- wildcard: ab\*c?d\*abc\*a?d
  - 只有 *：ab\*cd\*abc\*a?d
  - 只有 ?：c?d，a?d

最后一个 \* 号尽量多匹配，前面的 \* 号尽量少匹配。

```javascript
function find(source, pattern) {
  let starCount = 0
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '*') starCount++
  }

  if (starCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') return false
    }
    return
  }

  let i = 0
  let lastIndex = 0

  for (i = 0; pattern[i] != '*'; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== '?') return false
  }

  lastIndex = i

  for (let p = 0; p < starCount - 1; p++) {
    i++
    let subPattern = ''
    while(pattern[i] !== '*') {
      subPattern += pattern[i]
      i++
    }

    let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g')
    reg.lastIndex = lastIndex

    if (!reg.exec(source)) return false

    lastIndex = reg.lastIndex
  }

  for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
    if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== '?') return false
  }
  return true
}
```