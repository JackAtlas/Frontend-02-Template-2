# 第六周｜重学CSS

## 1. CSS总论｜CSS语法的研究

### CSS 总体结构

- @charset
- @import
- rules
  - @media
  - @page
  - rule

## 2. CSS总论｜CSS @规则的研究

- At-rules
  - @charset: [https://www.w3.org/TR/css-syntax-3/](https://www.w3.org/TR/css-syntax-3/)
  - @import: [https://www.w3.org/TR/css-cascade-4/](https://www.w3.org/TR/css-cascade-4/)
  - @media: [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
  - @page: [https://www.w3.org/TR/css-page-3/](https://www.w3.org/TR/css-page-3/)
  - @counter-style: [https://www.w3.org/TR/css-counter-styles-3/](https://www.w3.org/TR/css-counter-styles-3/)
  - @keyframes: [https://www.w3.org/TR/css-animations-1/](https://www.w3.org/TR/css-animations-1/)
  - @fontface: [https://www.w3.org/TR/css-fonts-3/](https://www.w3.org/TR/css-fonts-3/)
  - @supports: [https://www.w3.org/TR/css3-conditional/](https://www.w3.org/TR/css3-conditional/)
  - @namespace: [https://www.w3.org/TR/css-namespaces-3/](https://www.w3.org/TR/css-namespaces-3/)

## 3. CSS总论｜CSS规则的结构

- 选择器
- 声明
  - Key
  - Value

```css
div {
  background-color: blue;
}
```

- Selector
  - [https://www.w3.org/TR/selectors-3/](https://www.w3.org/TR/selectors-3/)
  - [https://www.w3.org/TR/selectors-4/](https://www.w3.org/TR/selectors-3/)
- Key
  - Properties
  - Variables: [https://www.w3.org/TR/css-variables](https://www.w3.org/TR/css-variables)
- Value
  - [https://www.w3.org/TR/css-values-4/(https://www.w3.org/TR/css-values-4/)

## 4. CSS总论｜收集标准

## 5. CSS总论｜总结

- CSS 语法
- at-rule
- selector
- variables
- value
- 实验

## 6. CSS选择器｜选择器语法

- 简单选择器
  - *
  - div svg|a
  - .cls
  - #id
  - [attr=value]
  - :hover
  - ::before
- 复合选择器
  - <简单选择器> <简单选择器> <简单选择器>
  - * 或者 div 必须写在最前面
- 复杂选择器
  - <复合选择器> \<sp> <复合选择器>
  - <复合选择器> ">" <复合选择器>
  - <复合选择器> "~" <复合选择器>
  - <复合选择器> "+" <复合选择器>
  - <复合选择器> "||" <复合选择器>

## 7. CSS选择器｜选择器的优先级

选择器的优先级是对一个选择器里包含的简单选择器进行计数。

```css
#id div.a#id {
  // ...
}
```

按前两周的 specificity 规则得出 [0, 2, 1, 1]，根据 S = 0 * N^3 + 2 * N^2 + 1 * N^1 + 1，得出优先级 S。

取 N = 1000000，得 S = 2000001000001。

在老的浏览器比如 IE6 中，为了节省内存将 N 取值 255，导致出现 bug（256 个 class 优先级相当于一个 id）。现代浏览器就将 N 取大（如65536），一般会选择 16 进制上比较整的数，256 的整次幂，因为 256 刚好一个字节。

练习：请写出下面选择器的优先级

- div#a.b .c[id=x]
- #a:not(#b)
- *.a
- div.a

解答：

取 N = 1000000

- [0, 1, 3, 1]，S = 1000003000001
- [0, 2, 0, 0], S = 2000000000000
- [0, 0, 1, 0], S = 1000000
- [0, 0, 1, 1], S = 1000001

## 8. CSS选择器｜伪类

- 链接/行为
  - :any-link
  - :link, :visited
  - :hover
  - :active
  - :focus
  - :target
- 树结构
  - :empty
  - :nth-child()
  - :nth-last-child()
  - :first-child, :last-child, :only-child
- 逻辑型
  - :not，现在只能在其中添加简单浏览器
  - :where :has

回顾之前的 toy-browser 运行原理会发现，`:empty`、`:nth-last-child`、`:last-child`、`:only-child` 其实破坏了 css 的计算时机，在浏览器中实现并不好，性能也不太好，尽量少用。

尽量不要将选择器编写得过于复杂，有需要可以从 HTML 方面着手，比如增加 class。

## 9. CSS选择器｜伪元素

- ::before
- ::after
- ::first-line
- ::first-letter

指定了 `::before` 或者 `::after` 后可以添加 `content` 属性添加文本内容，生成盒参与排版。

- first-line
  - font 系列
  - color 系列
  - background 系列
  - word-spacing
  - letter-spacing
  - text-decoration
  - text-transform
  - line-height
- first-letter
  - font 系列
  - color 系列
  - background 系列
  - text-decoration
  - text-transform
  - letter-spacing
  - word-spacing
  - line-height
  - float
  - vertical-align
  - 盒模型系列：margin, padding, border

思考：为什么 first-letter 可以设置 display:block 之类的，而 first-line 不可以？

答：`first-letter` 和 `first-line` 的计算时机不同，`first-letter` 匹配到的文本在 css compute 之前就可以确定，而 `first-line` 匹配到的文本需在渲染后才能确定。如果给 `first-line` 添加了可以改变盒模型、改变排版的属性，则应用了这些属性后，原本 `first-line` 匹配的文本就不一定完全匹配了，需要重新计算，这样就陷入了死循环。

作业：编写一个 match 函数，见 [match.js](./match.js)

```javascript
function match(selector, element) {
  return true;
}

match('div #id.class', document.getElementById('id'))
```