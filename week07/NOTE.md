# 第七周｜重学CSS

## 1. CSS排版｜盒

关于标签（Tag）、元素（Element）和盒（Box）

- HTML 代码中可以书写开始标签、结束标签和自封闭标签
- 一对起止标签，表示一个元素
- DOM 树中存储的是元素和其他类型的节点（Node）
- CSS 选择器选中的是元素或伪元素
- CSS 选择器选中的元素，在排版时可能产生多个盒
- 排版和渲染的基本单位是盒

- box-sizing
  - content-box
  - border-box

## 2. CSS排版｜正常流

- 收集盒进行
- 计算盒在行中的排布
- 计算行的排布

![正常流图示](https://user-images.githubusercontent.com/4383746/89727498-10ad6e00-da58-11ea-9d1f-96767cdbf158.JPG)

文字、inline-level-box 都放在行内，这样的行叫 line-box。整体来看，正常流就是 line-box 和 box-level-box 从上到下的排列。排列的信息分别叫做 inline-level-formatting-context（IFC，行内级格式化上下文）和 block-level-formatting-context（BFC，块级格式化上下文）。

## 3. CSS排版｜正常流的行级排布

### Text

![文字](https://user-images.githubusercontent.com/4383746/89727890-43a53100-da5b-11ea-9132-e3ebb294b6ac.JPG)

### 行模型

![行模型](https://user-images.githubusercontent.com/4383746/89727891-44d65e00-da5b-11ea-85a1-3bc5822d9964.JPG)

- text-top 和 text-bottom 由字号决定，不同字体混排时由字号最大的字体的字号所决定
- 当行高大于文字高度时有 line-top 和 line-bottom
- 当 inline-level-box 高度足够大时会把 line-box 撑开，使 line-top 或 line-bottom 发生偏移
- inline-box 的基线是随其中的文字变化的，有文字的情况下以其中的最后一行文字的基线为基线，无文字的情况下以 inline-box 的底线为基线，因此一般不建议 inline-box 以基线对齐

## 4. CSS排版｜正常流的块级排布

### float 与 clear

根据 w3c 的规则，float 的排布逻辑可作如下理解：先把 float 的元素根据正常流排到页面的某个位置，然后朝着 float 的方向去挤一下，再根据其占据的区域去调整 line-box 的尺寸和位置。凡是这个浮动的元素所占据的高度范围内，所有的 line-box 都会进行调整。

如果在第二步“挤”的过程中遇到了另一个浮动的元素就会停下。

要使浮动的元素强行换行可以使用 `clear` 属性，如：`float:left; clear:left;`。有人会把 `clear` 翻译成清除浮动，是不准确的，其实是找一个干净的空间来执行浮动的操作。

### Margin Collapse

BFC 中会有纵向的 margin 折叠的现象，这是继承自印刷行业的排布规则。

## 5. CSS排版｜BFC合并

- Block
  - Block Container：里面有 BFC 的盒，即能容纳正常流的盒
  - Block-level Box：外面有 BFC 的
  - Block Box = Block Container + Block-level Box：里外都有 BFC 的

### Block Container

- block
- inline-block
- table-cell
- flex item
- grid cell
- table-caption

### Block-level Box

大多数的 display 属性都有成对的值。

| Block level | Inline level |
|---|---|
| display: block | display: inline-block |
| display: flex | display: inline-flex |
| display: table | display: inline-table |
| display: grid | display: inline-grid |
| ... | ... |

### 设立 BFC

- floats
- absolutely positioned elements
- block containers
- and block boxes with 'overflow' other than 'visible'

### BFC 合并

默认能容纳正常流的盒，都认为会创建 BFC，只有一种情况例外：block box && overflow: visible。Block box 身处 BFC 中，体内也是 BFC，并且 `overflow: visible` 此时会发生 BFC 合并，会有如下影响：

- float
- 边距折叠

发生 BFC 合并后会按照在同一个 BFC 中的排布逻辑来进行排布，可以通过更改 overflow 的值来打破 BFC 合并的现象。

## 6. CSS排版｜Flex排版

- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布

分行的逻辑：

- 根据主轴尺寸，把元素分进行
- 若设置了 no-wrap，则强行分配进第一行

计算主轴方向

- 找出所有 Flex 元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- 若剩余空间为负数，所有 flex 元素设为 0，等比压缩剩余元素

计算交叉轴方向：

- 根据每一行中最大元素尺寸计算行高
- 根据行高 flex-align 和 item-align，确定元素具体位置

## 7. CSS动画与绘制｜动画

### Animation

- @keyframes 定义
- animation 使用

例：

```css
@keyframes mykf {
  from {
    background: red;
  }
  to {
    background: yellow;
  }
}

div {
  animation: mykf 5s infinite;
}
```

- animation-name 动画名称
- animation-duration 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延迟
- animation-iteration-count 动画的播放次数
- animation-direction 动画的方向（正放、倒放）

### Transition

- transition-property 要变换的属性
- transition-duration 变换的时长
- transition-timing-function 时间曲线
- transition-delay 延迟

### cubic-bezier

三次贝塞尔曲线（[https://cubic-bezier.com/](https://cubic-bezier.com/)）。

贝塞尔曲线有强大的拟合能力，三次贝塞尔曲线可以拟合抛物线。

## 8. CSS动画与绘制｜颜色

### CMYK 与 RGB

人有三种视锥细胞，分别可以接收红、绿、蓝三种颜色的光（RGB），通过按不同比例组合这三种颜色可以得到人眼能接收的所有颜色光。绘画中所说的三原色指品红、黄、青，是红绿蓝的补色，印刷业出于经济原因会多用一种黑色颜料（CMYK）。

### HSL 与 HSV

- Hue 色相，指色盘中的角度
- Saturation 纯度
- Lightness 亮度
- V Brightness 明度

## 9. CSS动画与绘制｜绘制

- 几何图形
  - border
  - box-shadow
  - border-radius
- 文字
  - font
  - text-decoration
- 位图
  - background-image

### 应用技巧

- data uri + svg