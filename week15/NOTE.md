# 十五周｜组件化

接上周。将之前写的轮播图组件，用 Gesture 和 Animation 库进行改写。

## 1. 轮播组件｜手势动画应用

```javascript
import { Component } from './framework'
import { enableGesture } from './gesture'
import { Timeline, Animation } from './animation'
import { ease } from './ease'

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

    enableGesture(this.root)
    let timeline = new Timeline
    timeline.start()

    let handler = null

    let children = this.root.children

    let position = 0

    let t = 0

    let ax = 0

    this.root.addEventListener('start', event => {
      timeline.pause()
      clearInterval(handler)
      if (Date.now() - t < 1500) {
        let progress = (Date.now() - t) / 500
        ax = ease(progress) * 500 - 500
      } else {
        ax = 0
      }
    })

    this.root.addEventListener('pan', event => {
      let x = event.clientX - event.startX - ax
      let current = position - Math.round((x - x % 500) / 500)

      for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
        let pos = current + offset
        pos = (pos % children.length + children.length) % chldren.length

        children[pos].style.transition = 'none'
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
      }
    })

    this.root.addEventListener('panend', event => {
      timeline.reset()
      timeline.start()
      handler = setInterval(nextPicture, 3000)

      let x = event.clientX - event.startX - ax
      let current = position - Math.round((x - x % 500) / 500)

      let direction = Math.round((x % 500) / 500) // -1, 0, 1

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500)
        } else {
          direction = Math.floor((x % 500) / 500)
        }
      }

      for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
        let pos = current + offset
        pos = (pos % children.length + children.length) % chldren.length

        children[pos].style.transition = ''
        timeline.add(new Animation(children[pos].style, "transform",
            -pos * 500 + offset * 500,
            -pos * 500 + offset * 500 + direction * 500,
            500, 0, ease, v => `translateX(${v}px)`))
      }

      position = position - ((x - x % 500) / 500) - direction)
      position = (postion % children.length + children.length) % children.length
    })

    let nextPicture = () => {
      let children = this.root.children
      let nextIndex = (position + 1) % children.length

      let current = children[position]
      let next = children[nextIndex]

      timeline.add(new Animation(current.style, "transform", -position * 500, - 500 -position * 500, 500, 0, ease, v => `translateX(${v}px)`))
      timeline.add(new Animation(next.style, "transform", 500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`))
      
      position = nextIndex
    }

    handler = setInterval(nextPicture, 3000)

    return this.root
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}
```

## 2. 轮播组件｜为组件添加更多属性（一）

为组件添加一个状态的机制，将部分逻辑抽象到 Component

```javascript
// framework.js
// 不希望被外部访问的变量用 Symbol 保护起来
export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null)
    this[STATE] = Object.create(null)
  }
  setAttributes(name, value) {
    this.attributes[name] = value
  }
  //...
  mountTo(parent) {
    if (!this.root) this.render()
    parent.appendChild(this.root)
  }
}

// carousel.js
// 去除 constructor 里除了 super() 的部分
export {STATE, ATTRIBUTE} from './framework' // 相当于 import 了再 export 且当前可用

// 把 position 放到 this[STATE] 下
this[STATE].position = 0
```

轮播组件需要有信息表示的机制

```javascript
// main.js
let a = <Carousel src={d} onChange={event => console.log(event.detail.position)} />
a.mountTo(document.body)

// framework.js
class Component {
  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUppercase())](new CustomEvent(type, {detail: args}))
  }
}

// gesture.js
// 在设置 position 的地方加上
this[STATE].position = nextPosition
this.triggerEvent('change', { position: this[STATE].position })
```

给图片加上点击事件

```javascript
// carousel.js
this.root.addEventListener('tap', event => {
  this.triggerEvent('click', {
    data: this[ATTRIBUTE].src[this[STATE].position],
    position: this[STATE].position
  })
})
```

## 3. 轮播组件｜为组件添加更多属性（二）

内容型 children 和 模板型 children。

内容型：

```javascript
// Button.js
import { Component, createElement } from './framework'

export { STATE, ATTRIBUTE } from './framework'

export class Button extends Component {
  constructor() {
    super()
  }

  render() {
    this.childContainer = (<span />)
    this.root = (<div>{this.childContainer}</div>).render()
    return this.root
  }

  appendChild(child) {
    if (!this.childContainer) this.render()
    this.childContainer.appendChild(child)
  }
}

// framework.js
class Component {
  // ...
  render() {
    return this.root
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
}

// main.js
let a = <Button>content</Button>
a.mountTo(document.body)
```

模板型：

```javascript
// main.js
let a = <List data={d}>
  {record =>
    <div>
      <img src={record.img} />
      <a href={record.url}>{record.title}</a>
    </div>
  }
</List>

// framework.js
function createElement(type, attributes, ...children) {
  // ...
  let processChildren = children => {
    for (let child of children) {
      if (typeof child === 'object' && (child instanceof Array)) {
        processChildren(child)
        continue
      }
      if (typeof child === 'string') child = new TextWrapper(child)
      element.appendChild(child)
    }
  }
  processChildren(children)
}

class ElementWrapper extends Component {
  // ...
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
}

// List.js
// ...
render() {
  this.children = this[ATTRIBUTE].data.map(this.template)
  this.root = (<div>{this.children}</div>).render()
  return this.root
}

appendChlid(child) {
  this.template = child
  this.render()
}
```