# 十四周｜组件化

## 1. 手势与动画｜手势的基本认识

![14-1](https://user-images.githubusercontent.com/4383746/94524634-74d4fd00-0265-11eb-95b5-b830ede9a8cc.JPG)

## 2. 手势与动画｜实现鼠标操作

touch 相关事件一定会在同一个对象上触发，不可能跳过 touchstart 去触发 touchmove，所以 touch 相关事件的监听写法不需和 mouse 相关事件的监听写法一样嵌套。

将 start、move、end、cancel 事件抽象出来，让 mouse 和 touch 可以共用。

```javascript
let element = document.documentElement

// mouse 相关事件
element.addEventListener('mousedown', event => {
  start(event)

  let mousemove = event => {
    move(event)
  }

  let mouseup = event => {
    end(event)
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  }

  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
})

// touch 相关事件
element.addEventListener('touchstart', event => {
  console.log(event.changedTouches) // TouchList 数组，触点可能会有多个

  for (touch in event.chengedTouches) {
    start(touch)
  }
})

element.addEventListener('touchmove', event => {
  for (touch in event.chengedTouches) {
    move(touch)
  }
})

element.addEventListener('touchend', event => {
  for (touch in event.chengedTouches) {
    end(touch)
  }
})

// touchcancel 表示手势以异常的方式结束，比如被 alert 打断
element.addEventListener('touchcancel', event => {
  for (touch in event.chengedTouches) {
    cancel(touch)
  }
})

let start = point => {}
let move = point => {}
let end = point => {}
let cancel = point => {}
```

## 3. 手势与动画｜实现手势的逻辑

回看第一节的流程图，开始的时候有几个逻辑：

1. 是否正常 end，形成 tap
2. 是否移动 10px
3. 是否经过 0.5s

下面来一一实现。

1. 0.5s 的实现：

```javascript
let handler

let start = point => {
  handler = setTimeout(() => {
    console.log('pressstart')
  }, 500)
}
```

2. 10px 的实现：

```javascript
let handler
let startX, startY
let isPan = false

let start = point => {
  startX = point.clientX, startY = point.clientY
  isPan = false
  handler = setTimeout(() => {
    console.log('pressstart')
  }, 500)
}

let move = point => {
  let dx = point.clientX - startX, dy = point.clientY - startY

  if (!isPan && dx ** 2 + dy ** 2 > 100) { // 移动 10px
    isPan = true
    console.log('panstart')
    clearTimeout(handler)
  }

  if (isPan) {
    console.log('pan')
  }
}
```

3. 是否正常 end 的实现：

```javascript
let handler
let startX, startY
let isPan = false, isTap = true, isPress = false

let start = point => {
  startX = point.clientX, startY = point.clientY

  isTap = true
  isPan = false
  isPress = false

  handler = setTimeout(() => {
    isTap = false
    isPan = false
    isPress = true
    handler = null
    console.log('pressstart')
  }, 500)
}

let move = point => {
  let dx = point.clientX - startX, dy = point.clientY - startY

  if (!isPan && dx ** 2 + dy ** 2 > 100) { // 移动 10px
    isTap = false
    isPan = true
    isPress = false
    console.log('panstart')
    clearTimeout(handler)
  }

  if (isPan) {
    console.log('pan')
  }
}

let end = point => {
  if (isTap) {
    console.log('tap')
    clearTimeout(handler)
  }
  if (isPan) {
    console.log('panend')
  }
  if (isPress) {
    console.log('pressend')
  }
}

let cancel = point => {
  clearTimeout(handler)
}
```

## 4. 手势与动画｜处理鼠标事件

鼠标事件有左右键区分、触摸事件也可能有多个触摸点，因此 `handler` 等变量放在全局是不合适的，将这些变量放在 `context` 里。 `context` 在 `touchstart` 事件时被创建，以 `touch.identifier` 为 key 保存在名为 “contexts” 的 Map 中。

```javascript
let contexts = new Map()

element.addEventListener('touchstart', event => {
  for (let touch of event.changedTouches) {
    let context = Object.create(null)
    contexts.set(touch.identifier, context)
    start(touch, context)
  }
})

element.addEventListener('touchmove', event => {
  for (let touch of event.changedTouches) {
    let context = contexts.get(touch.identifier)
    move(touch, context)
  }
})

element.addEventListener('touchend', event => {
  for (let touch of event.changedTouches) {
    let context = contexts.get(touch.identifier)
    end(touch, context)
    contexts.delete(touch.identifier)
  }
})

element.addEventListener('touchcancel', event => {
  for (let touch of event.changedTouches) {
    let context = contexts.get(touch.identifier)
    cancel(touch, context)
    contexts.delete(touch.identifier)
  }
})

let start = (point, context) => {
  context.startX = point.clientX, context.startY = point.clientY

  context.isTap = true
  context.isPan = false
  context.isPress = false

  context.handler = setTimeout(() => {
    context.isTap = false
    context.isPan = false
    context.isPress = true
    context.handler = null
    console.log('pressstart')
  }, 500)
}

let move = (point, context) => {
  let dx = point.clientX - context.startX, dy = point.clientY - context.startY

  if (!context.isPan && dx ** 2 + dy ** 2 > 100) { // 移动 10px
    context.isTap = false
    context.isPan = true
    context.isPress = false
    console.log('panstart')
    clearTimeout(context.handler)
  }

  if (context.isPan) {
    console.log('pan')
  }
}

let end = (point, context) => {
  if (context.isTap) {
    console.log('tap')
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('panend')
  }
  if (context.isPress) {
    console.log('pressend')
  }
}

let cancel = (point, context) => {
  clearTimeout(context.handler)
}
```

mouse 事件也要补全 `context`，在 `mousemove` 事件中有一个属性 `event.buttons` 表示有哪些键被按着，它的值是一个二进制掩码。形如 0b00001，最后一位表示左键，倒数第二位表示中键，倒数第三位表示右键，1 表示按下，0 表示没有按下。

含移位相关知识，有待学习。

```javascript
let isListeningMouse = false // 当有多个键被同时按下，也只触发一次事件绑定

element.addEventListener('mousedown', event => {
  let context = Object.create(null)
  contexts.set('mouse' + (1 << event.button), context)

  start(event, context)

  let mousemove = event => {
    let button = 1
    while (button <= event.buttons) {
      if (button & event.buttons) {
        // order of buttons & button property is not same
        let key
        if (button === 2) {
          key = 4
        } else if (button === 4) {
          key = 2
        } else {
          key = button
        }
        let context = contexts.get('mouse' + key)
        move(event, context)
      }
      button = button << 1
    }
  }

  let mouseup = event => {
    let context = contexts.get('mouse' + (1 << event.button))
    end(event, context)
    contexts.delete('mouse' + (1 << event.button))

    if (event.buttons === 0) {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      isListeningMouse = false
    }
  }

  if (!isListeningMouse) {
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
    isListeningMouse = true
  }
})
```

## 5. 手势与动画｜派发事件

```javascript
function dispatch(type, properties) {
  let event = new Event(type)
  for (let name in properties) {
    event[name] = properties[name]
  }
  element.dispatchEvent(event)
}
```

在 `end` 事件进行派发：

```javascript
let end = (point, context) => {
  if (context.isTap) {
    dispatch('tap', {})
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('panend')
  }
  if (context.isPress) {
    console.log('pressend')
  }
```

## 6. 手势与动画｜实现一个 flick 事件

在 `start` 事件中创建点的集合：

```javascript
let start = (point, context) => {
  // ...

  context.points = [{
    t: Date.now(),
    x: point.clientX,
    y: point.clientY
  }]

  // ...
}
```

在 `move` 事件中记录一系列的点，只记录 500ms 以前的点：

```javascript
let move = (point, context) => {
  // ...

  context.points = context.points.filter(point => Date.now() - point.t < 500)

  contexts.points.push({
    t: Date.now(),
    x: point.clientX,
    y: point.clientY
  })
}
```

在 `end` 事件中判断速度，如果大于 1.5px/ms 则触发 `flick` 事件：

```javascript
let end = (point, context) => {
  // ...

  context.points = context.points.filter(point => Date.now() - point.t < 500)
  let d, v
  if (!contexts.points.length) {
    v = 0
  } else {
    d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2)
    v = d / (Date.now() - context.points[0].t)
  }

  if (v > 1.5) { // px/ms
    context.isFlick = true
  } else {
    context.isFlick = false
  }
}
```

## 7. 手势与动画｜封装

将代码进行解耦会发现，代码大致上分为三个部分：listen、recognize、dispatch。

完整代码见 [gesture.js](./gesture.js)