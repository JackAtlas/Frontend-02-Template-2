# 第十二周｜组件化

前端架构方面最热门的两个话题，一个是组件化，另一个是架构模式。组件化主要的目标就是复用；架构模式主要关心前端和数据逻辑层的交互。组件化的程度直接决定了前端团队的代码复用率，好的组件化体系能让开发者少很多心智负担。

## 1. 组件的基本知识｜组件的基本概念和基本组成部分

### 对象与组件

- 对象
  - Properties 属性
  - Methods 方法
  - Inherit 继承
- 组件
  - Properties 属性
  - Methods 方法
  - Inherit 继承
  - Attribute 特性
  - Config & State 配置&状态
  - Event 事件
  - Lifecycle 生命周期
  - Children 子组件，树形结构的必要条件

一般我们认为组件是跟 UI 强相关的东西，某种意义上是一种特殊的模块或者是特殊的对象，既是对象也是模块，特点是可以以树形结构来进行组合并且有模块化配置的能力。

对象有三大要素：属性、方法和继承关系。

### Component

![component](https://user-images.githubusercontent.com/4383746/93032756-c4140e80-f665-11ea-8e8d-cf448dbd2ae3.JPG)

### Attribute

#### Attribute vs Property

- Attribute 强调描述性
- Property 强调从属关系

HTML 就是一个 attribute 和 property 不等效的系统

Attribute：

```javascript
// <my-component a="v"></my-component>
myComponent.getAttribute('a')
myComponent.setAttribute('a', 'value')
```

Property：
```javascript
myComponent.a = 'value'
```

场景一：

```javascript
// <div class="cls1 cls2"></div>

var div = document.getElementsByTagName('div')[0]
div.className // cls1 cls2
```

在此例中，class 是 attribute，className 是 property。

场景二：

```javascript
// <div class="cls1 cls2" style="color:blue"></div>

var div = document.getElementsByTagName('div')[0]
div.style // 对象
```

在此例中，style attribute 的值是字符串，style property 的值是语义化的 key-value 结构对象。

场景三：

```javascript
// <a href="//m.taobao.com"></a>

var a = document.getElementsByTagName('a')[0]
a.getAttribute('href') // "//m.taobao.com"，跟 HTML 代码中完全一致
a.href // "http://m.taobao.com"，这个 URL 是 resolve 过的结果
```

场景四：

```javascript
// <input value="cute" />

var input = document.getElementsByTagName('input')[0] // 若没有设置 property，则结果是 attribute

input.value // cute
input.getAttribute('value') // cute
input.value = 'hello' // 若 value 属性已经设置，则 attribute 不变，property 变化，元素上实际的效果是 property 优先
input.value // hello
input.getAttribute('value') // cute
```

在此例中，attribute value 相当于一个默认值，不随用户操作而改变；input 显示值优先显示 property。

### 如何设计组件状态

|Markup set|JS set|JS Change| User Input Change||
|---|---|---|---|---|
|false|true|true|?|property|
|true|true|true|?|attribute|
|false|false|false|true|state|
|false|true|false|false|config|

- property 不能被 markup 标签设置，可以由 JS 设置，可以被 JS 改变，大部分情况下不由用户输入去改变，少数情况下可能会来自随用户输入而改变的业务逻辑
- attribute 可以由 markup 标签设置，可以由 JS 设置，可以被 JS 改变，用户输入与 property 类似
- state 一般只能从组件的内部去改变，而不能（被组件使用者）从外部改变；一般可随用户输入而改变
- config 是一次性“道具”，只有在组件构造的时候使用，通常会放在全局

### Lifecycle

- created
- mount/unmount （挂载/卸载）
- render/update （由 JS change/set 和 User Input 触发）
- destroyed

### Children

Content 型 Children 与 Template 型 Children

```html
<my-button><img src="{{icon}}" />{{title}}</my-button>

<my-list>
  <li><img src="{{icon}}" />{{title}}</li>
</my-list>
```

## 2. 组件的基本知识｜为组件添加JSX语法

### 配置 jsx 环境：

- webpack、webpack-cli
- babel-loader、@babel/core、@babel/preset-env
- @babel/plugin-transform-react-jsx

jsx 的标签会被编译成 `React.createElement`。

## 3. 组件的基本知识｜JSX的基本使用方法

先来看 babel 是如何编译的：

```javascript
let a =
  <div id="a">
    <span></span>
    <span></span>
    <span></span>
  </div>

// babel 编译成：
var a = createElement('div', {
  id: 'a'
},
createElement('span', null)
createElement('span', null)
createElement('span', null)
)
```

模仿实现 createElement 方法：

```javascript
function createElement(type, attributes, ...children) {
  let element
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type
  }
  for (let name in attributes) { // 对象遍历用 for...in...
    element.setAttribute(name, attributes[name])
  }
  for (let child of children) { // 数组遍历用 for...of...
    if (typeof child === 'string') child = new TextWrapper(child) // 处理文本节点
    element.appendChild(child)
  }
  return element // 返回一个 DOM 节点
}

class Component {
  constructor(type) {}
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root.document.createElement(type)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    this.root.document.createTextNode(content)
  }
}

class Div {
  constructor() {
    this.root = document.createElement('div')
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

let a =
<Div id="a">
  <span></span>
  <span></span>
  <span></span>
</Div>

// document.body.appendChild(a)
a.mountTo(document.body)
```

此法可以用于编写自定义组件，在 class 的定义里加入自己的方法。

## 4. 轮播组件｜轮播组件（一）

*4、5 并作一起*

用正常流布局，将父元素设为 `white-space: nowrap;`，子元素设为 `display: inline-block;`，使其横排。

```css
.carousel {
  overflow: hidden;
  width: 500px;
  height: 280px;
  white-space: nowrap;
}

.carousel > div {
  display: inline-block;
  width: 500px;
  height: 280px;
  background-size: contain;
  transition: ease 0.5s;
}
```

```javascript
import { Component, createElement } from './framework'

class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }
  render() {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (let record of this.attributes.src) {
      let child = document.createElement('div')
      child.style.backgroundImage = `url('${record}')` // 用背景而不是 Img
      this.root.appendChild(child)
    }

    let currentIndex = 0

    setInterval(() => {
      // 轮播执行时，只需关心当前的子元素和下一个子元素，不需要操作全部子元素
      let children = this.root.children
      let nextIndex = (currentIndex + 1) % children.length

      let current = children[currentIndex]
      let next = children[nextIndex]

      next.style.transition = 'none'
      next.style.tranform = `translateX(${100 - nextIndex * 100}%)`
      
      setTimeout(() => {
        next.style.transition = ''
        current.style.transform = `translateX(-${-100 - currentIndex * 100}%)`
        next.style.transform = `translateX(${-nextIndex * 100}%)`

        currentIndex = nextIndex
      }, 16)
    }, 3000)

    return this.root
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}

let d = [] // 图片地址数组

let a = <Carousel src={d} />
```

## 6. 轮播组件｜轮播组件（三）

轮播组件的一个常见功能是可拖动，这个功能和自动播放是有冲突的，单独实现：

*PS: 鼠标事件的设置细节详见上一篇的第 7 节*

```javascript
import { Component, createElement } from './framework'

class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }
  render() {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (let record of this.attributes.src) {
      let child = document.createElement('div')
      child.style.backgroundImage = `url('${record}')` // 用背景而不是 Img
      this.root.appendChild(child)
    }

    let position = 0

    this.root.addEventListener('mousedown', event => {
      let children = this.root.children
      let startX = event.clientX

      let move = event => {
        let x = event.clientX - startX

        let current = position - Math.round((x - x % 500) / 500)

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + children.length) % chldren.length
          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
        }
      }

      let up = event => {
        let x = event.clientX - startX
        position = position - Math.round(x / 500)

        for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = current + offset
          pos = (pos + children.length) % chldren.length

          children[pos].style.transition = ''
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
        }

        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    return this.root
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}

let d = [] // 图片地址数组

let a = <Carousel src={d} />
```