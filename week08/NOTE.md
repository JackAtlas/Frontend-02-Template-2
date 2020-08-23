# 第八周

## 1. 重学HTML｜HTML的定义：XML和SGML

### DTD与XML namespace

[https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)
[https://www.w3.org/1999/xhtml/](https://www.w3.org/1999/xhtml/)

## 2. 重学HTML｜HTML标签语义

大部分的 HTML 标签都有其语义。

## 3. 重学HTML｜HTML语法

合法元素：

- Element: \<tagname>...\</tagname>
- Text: text
- Comment: \<!-- comments -->
- DocumentTypes: \<!Doctype html>
- ProcessingInstruction: \<?a 1?>
- CDATA: \<![CDATA[]]>

字符引用：

- \&#161; &#161;
- \&amp; &amp;
- \&lt; &lt;
- \&quot; &quot;

## 4. 重学HTML｜DOM API

- Node
  - Element：元素型节点，跟标签相对应
    - HTMLElement
      - HTMLAnchorElement
      - HTMLAppleElement
      - HTMLAreaElement
      - HTMLAudioElement
      - HTMLBaseElement
      - HTMLBodyElement
      - ...
    - SVGElement
      - SVGAElement
      - SVGAGlyphElement
      - ...
  - Document：文档根节点
  - CharacterData：字符数据
    - Text：文本节点
      - text
      - CDATASection：CDATA 节点
    - Comment：注释
    - ProcessingInstruction：预处理信息
  - DocumentFragment：文档片段
  - DocumentType：文档类型

### 导航类操作

|节点 API|元素 API|
|---|---|
|parentNode|parentElement|
|childNodes|children|
|firstChild|firstElementChild|
|lastChild|lastElementChild|
|nextSibling|nextElementSibling|
|previousSibling|previousElementSibling|

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

### 高级操作

- compareDocumentPosition 用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个检点是否完全相同
- isSameNode 检查两个节点是否是同一个节点，实际上在 JavaScript 中可以用“===”
- cloneNode 复制一个节点，如果传入参数 true，则会连同子元素做深拷贝

## 5. 浏览器API｜事件API

## Event：捕获与冒泡

## 6. 浏览器API｜Range API

### Range API

- var range = new Rang()
- range.setStart(element, offset)
- range.setEnd(element, offset)
- var range = document.getSelection().getRangeAt(0)

range 有起点和终点，只要起点在终点前即可，不要求层级关系和节点边界。起止点都是由 element 和 offset（偏移值） 决定的。对于元素节点，其偏移值是子元素；对于文本节点，其偏移值是文字的个数。

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode 选中某个节点
- range.selectNodeContents 选中某个节点的内容

对 range 的操作：

- `var fragment = range.extractContents()`，把 range 的内容完全提取出来（脱离了 dom 数），存入一个 fragment 中
- range.insertNode(document.createTextNode('aaa'))

### 例子：把一个元素的所有子元素逆序

```html
<div id="a">
  <span>1</span>
  <p>2</p>
  <a>3</a>
  <div>4</div>
</div>
```

隐藏考点：

1. DOM 的 collection 是 living collection
2. 元素 insert 的时候不需要先从原来的位置 remove

```javascript
方法一：
let element = document.getElementById('a')

function reverseChildren(element) {
  let children = Array.prototype.slice.call(element.childNodes)

  for (let child of children) {
    element.removeChild(child)
  }
  // element.innerHTML = ''

  children.reverse()

  for (let child of children) {
    element.appendChild(child)
  }
}

reverseChildren(element)
```

```javascript
方法二：
let element = document.getElementById('a')

function reverseChildren(element) {
  var l = element.childNodes.length
  while(l-- > 0) {
    element.appendChild(element.childNodes[l])
  }
}

reverseChildren(element)
```

```javascript
方法三：
let element = document.getElementById('a')

function reverseChildren(element) {
  let range = new Range()
  range.selectNodeContents(element)

  let fragment = range.extractContents()
  var l = fragment.childNodes.length
  while(l-- > 0) {
    fragment.appendChild(fragment.childNodes[l])
  }
  element.appendChild(fragment)
}

reverseChildren(element)
```

> 假设子元素有 x 个，方法一引起重排 2x 或 x + 1 次，方法二引起重排 x 次，方法三引起重排 2 次。

## 7. 浏览器API｜CSSOM

### document.styleSheets

- .cssRules
- .insertRule("p {color: pink;}", 0)，第二个参数是位置
- .removeRule(0)

### Rule

- CSSStyleRule
  - selectorText String
  - style K-V结构
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule
- ...

### getComputedStyle

- window.getComputedStyle(elt, pseudoElt)
  - elt 想要获取的元素
  - pseudoElt 可选，伪元素

例：`window.getComputedStyle(document.querySelector('a'), '::before')`

## 8. 浏览器API｜CSSOM View

### window

- window.innerHeight, window.innerWidth *
- window.outerHeight, window.outerWidth
- window.devicePixelRatio *
- window.screen
  - window.screen.width
  - window.screen.height
  - window.screen.availWidth
  - window.screen.availHeight

### window API

- window.open('about:blank', '_blank', 'width=100,height=100,left=100,top=100')
- moveTo(x, y)
- moveBy(x, y)
- resizeTo(x, y)
- resizeBy(x, y)

### scroll

- scrollTop
- scrollLeft
- scrollWidth
- scrollHeight
- scroll(x, y)
- scrollBy(x, y)
- scrollIntoView()

&nbsp;

- window
  - scrollX
  - scrollY
  - scroll(x, y)
  - scrollBy(x, y)

### layout

- getClientRects()，获取所有盒子
- getBoundingClientRect()，获取一个“圈住”所有盒子的“矩形”

这两个 API 可以很方便地用于计算页面元素的位置、距离等。

> 伪元素在页面上无法被选中

## 9. 浏览器API｜其他API

### 标准化组织

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG 社区组/WG 工作组/IG 兴趣组