# 十三周｜组件化

（接上周）

## 1. 手势与动画｜初步建立动画和时间线

时间轴：

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')

class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
  }
  start() {
    let startTime = Date.now()
    this[TICK] = () => {
      let t = Date.now() - startTime
      for (let animation of this[ANIMATIONS]) {
        let t0 = t
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t0 = animation.duration
        }
        animation.receiveTime(t0)
      }
      requestAnimationFrame(this[TICK])
    }
  }

  pause() {}
  resume() {}

  reset() {}

  add(animation) {
    this[ANIMATIONS].add(animation)
  }
}
```

设计上可能还会有 rate 等功能。

动画：

*PS：动画的实现方式可能会有帧动画、属性动画等，前端动画一般用属性动画来实现。*

```javascript
class Animation {
  constructor(object, property, startValue, endValue, duration, timingFunction) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.timingFunction = timingFunction
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.startValue + range * time / this.duration
  }
}
```

## 2. 手势与动画｜时间线的更新

css 的 transition 动画里有一个 delay 的概念，我们可以引入此设计，但不是放在 Animation 而是放在 Timeline。

时间轴：

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')

class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  start() {
    let startTime = Date.now()
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime
        } else {
          t = now - this[START_TIME].get(animation)
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        animation.receiveTime(t)
      }
      requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  pause() {}
  resume() {}

  reset() {}

  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now()
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}
```

动画：

```javascript
class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.startValue + range * time / this.duration
  }
}
```

## 3. 手势与动画｜给动画添加暂停和重启功能

时间轴：

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  start() {
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME]
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME]
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        animation.receiveTime(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
  }

  pause() {
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }
  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {}

  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now()
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}
```

动画：

```javascript
class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction
    this.template = template
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.template(this.startValue + range * time / this.duration)
  }
}
```

使用：

```javascript
let tl = new Timeline()

tl.start()

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 100, 1000, 0, null, v => `translateX(${v}px)`))

document.querySelector('#pause-btn').addEventListener('click', () => tl.pause())
```

## 4. 手势与动画｜完善动画的其他功能

时间轴：

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  start() {
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        if (t > 0) animation.receiveTime(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
  }

  pause() {
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }
  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {
    this.pause()
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
  }

  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now()
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}
```

动画：

```javascript
class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction || v => v
    this.template = template || v => v
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue
    let progress = this.timingFunction(time / this.duration) // timingFunction 应该返回一个 0~1 的系数
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}
```

## 5. 手势与动画｜对时间线进行状态管理

时间轴：

```javascript
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

class Timeline {
  constructor() {
    this.state = 'Inited'
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }
  start() {
    if (!this.state === 'Inited') return
    this.state = 'started'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        if (t > 0) animation.receiveTime(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
  }

  pause() {
    if (this.state !== 'started') return 
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }
  resume() {
    if (this.state !== 'paused') return 
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {
    this.pause()
    this.state = 'inited'
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
  }

  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now()
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}
```

动画：

```javascript
class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction || v => v
    this.template = template || v => v
  }

  receiveTime(time) {
    let range = this.endValue - this.startValue
    let progress = this.timingFunction(time / this.duration) // timingFunction 应该返回一个 0~1 的系数
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}
```