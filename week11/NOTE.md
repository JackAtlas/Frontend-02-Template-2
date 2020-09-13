# 第十一周｜编程与算法训练

## 1. proxy与双向绑定｜proxy的基本用法

Proxy 对象：`new Proxy(object, config)`

```javascript
let object = {
  a: 1,
  b: 2
}

let po = new Proxy(object, {
  set(obj, prop, val) { // 钩子
    console.log(obj, prop, val)
  }
})

// 运行：
// po.a = 3
// po.x = 5
```

Proxy 里不仅有 get、set 方法的钩子，原生函数或内置函数对对象的操作都可以拦截并改变其行为（参考 [http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)）。

调用 proxy 对象才会触发代理（`po.a = 3`），直接调用原始的对象并不会触发代理（`object.a = 3`）。

## 2. proxy与双向绑定｜模仿reactive实现原理（一）

```javascript
let object = {
  a: 1,
  b: 2
}

let po = reactive(object)

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val
      console.log(obj, prop, val)
      return obj[prop]
    },
    get(obj, prop) {
      console.log(obj, prop)
      return obj[prop]
    }
  })
}
```

## 3. proxy与双向绑定｜模仿reactive实现原理（二）

```javascript
let callbacks = []

let object = {
  a: 1,
  b: 2
}

let po = reactive(object)

effect(() => {
  console.log(po.a)
})

function effect(callback) {
  callbacks.push(callback)
}

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val
      for (let callback of callbacks) {
        callback()
      }
      return obj[prop]
    },
    get(obj, prop) {
      console.log(obj, prop)
      return obj[prop]
    }
  })
}
```

## 4. proxy与双向绑定｜模仿reactive实现原理（三）

```javascript
let callbacks = new Map()

let usedReactivities = []

let object = {
  a: 1,
  b: 2
}

let po = reactive(object)

effect(() => {
  console.log(po.a)
})

function effect(callback) {
  // callbacks.push(callback)
  usedReactivities = []
  callback()

  for (let reactivity of usedReactivities) {
    if (!callbacks.has(reactivity[0])) {
      callbacks.set(reactivity[0], new Map())
    }
    if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
      callbacks.get(reactivity[0]).set(reactivity[1], [])
    }
    callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
  }
}

function reactive(object) {
  return new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let callback of callbacks.get(obj).get(prop)) {
            callback()
          }
        }
      }
      return obj[prop]
    },
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      return obj[prop]
    }
  })
}
```

## 5. proxy与双向绑定｜优化reactive

```javascript
let callbacks = new Map()
let reactivities = new Map()

let usedReactivities = []

let object = {
  a: { b: 1 },
  b: 2
}

let po = reactive(object)

effect(() => {
  console.log(po.a)
})

function effect(callback) {
  // callbacks.push(callback)
  usedReactivities = []
  callback()

  for (let reactivity of usedReactivities) {
    if (!callbacks.has(reactivity[0])) {
      callbacks.set(reactivity[0], new Map())
    }
    if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
      callbacks.get(reactivity[0]).set(reactivity[1], [])
    }
    callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
  }
}

function reactive(object) {
  if (reactivities.has(object)) return reactivities.get(object)
  let proxy = new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let callback of callbacks.get(obj).get(prop)) {
            callback()
          }
        }
      }
      return obj[prop]
    },
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') return reactive(obj[prop])
      return obj[prop]
    }
  })

  reactivities.set(object, proxy)

  return proxy
}
```

## 6. proxy与双向绑定｜reactivity响应式对象

```javascript
let callbacks = new Map()
let reactivities = new Map()

let usedReactivities = []

let object = {
  a: { b: 1 },
  b: 2
}

let po = reactive(object)

effect(() => {
  document.getElementById('r').value = po.b
})

document.getElementById('r').addEventListener('input', event => po.b = event.target.value)

function effect(callback) {
  // callbacks.push(callback)
  usedReactivities = []
  callback()

  for (let reactivity of usedReactivities) {
    if (!callbacks.has(reactivity[0])) {
      callbacks.set(reactivity[0], new Map())
    }
    if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
      callbacks.get(reactivity[0]).set(reactivity[1], [])
    }
    callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
  }
}

function reactive(object) {
  if (reactivities.has(object)) return reactivities.get(object)
  let proxy = new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val

      if (callbacks.get(obj)) {
        if (callbacks.get(obj).get(prop)) {
          for (let callback of callbacks.get(obj).get(prop)) {
            callback()
          }
        }
      }
      return obj[prop]
    },
    get(obj, prop) {
      usedReactivities.push([obj, prop])
      if (typeof obj[prop] === 'object') return reactive(obj[prop])
      return obj[prop]
    }
  })

  reactivities.set(object, proxy)

  return proxy
}
```

## 7. 使用Range实现DOM精确操作｜基本拖拽

mousemove 和 mouseup 要在 document 上监听；如果在 dragable 上监听的话，当鼠标移出了 dragable 的范围就不响应了。另外，在 document 上监听，当鼠标移出了 viewport，仍然可以响应。

```html
<div id="dragable" style="width:100px;height:100px;background-color:pink;"></div>
```

```javascript
let dragable = document.getElementById('dragable')

let baseX = 0, baseY = 0

dragable.addEventListener('mousedown', function(event) {
  let startX = event.clientX, startY = event.clientY
  let up = () => {
    baseX = baseX + event.clientX - startX
    baseY = baseY + event.clientY - startY
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  let move = event => {
    dragable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
})
```

## 8. 使用Range实现DOM精确操作｜正常流里的拖拽

```html
<div id="container">文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 文字 文字 文字 文字 
文字 文字 文字 文字 </div>
<div id="dragable" style="display:inline-block;width:100px;height:100px;background-color:pink;"></div>
```

```javascript
let dragable = document.getElementById('dragable')

let baseX = 0, baseY = 0

dragable.addEventListener('mousedown', function(event) {
  let startX = event.clientX, startY = event.clientY
  let up = () => {
    baseX = baseX + event.clientX - startX
    baseY = baseY + event.clientY - startY
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  let move = event => {
    let range = getNearest(event.clicentX, event.clientY)
    range.insertNode(dragable)
    // dragable.style.transform = `translate(${baseX + event.clientX - startX}px, ${baseY + event.clientY - startY}px)`
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
})

let ranges = []
let container = document.getElementById('container')
for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
  let range = document.createRange()
  range.setStart(container.childNodes[0], i)
  range.setEnd(container.childNodes[0], i)

  // console.log(range.getBoundingClientRect())
  ranges.push(range)
}

// 从上述 range 里找离某个点最近的 range
function getNearest(x, y) {
  let min = Infinity
  let nearest = null

  for (let range of ranges) {
    let rect = range.getBoundingClientRect()
    let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2

    if (distance < min) {
      nearest = range
      min = distance
    }
  }

  return nearest
}

document.addEventListener('selectstart', event => event.preventDefault)
```