# 第五周 浏览器工作原理

## 1. CSS 计算｜收集CSS规则

- 遇到 style 标签时，我们把 CSS 规则保存起来
- 这里我们调用 CSS Parser 来分析 CSS 规则
- 这里我们必须要仔细研究此库分析 CSS 规则的格式

## 2. CSS 计算｜添加调用

- 当我们创建一个元素后，立即计算CSS
- 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕
- 在真实浏览器中，可能遇到写在body的style标签，需要重新计算CSS的情况，这里我们忽略

## 3. CSS 计算｜获取父元素序列

- 在 computeCSS 函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
- 我们从上一步骤的 stack，可以获取本元素所有的父元素
- 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外

## 4. CSS 计算｜选择器与元素的匹配

- 选择器也要从当前元素向外排列
- 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

## 5. CSS 计算｜计算选择器与元素匹配

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器

## 6. CSS 计算｜生成computed属性

- 一旦选择匹配，就应用选择器到元素上，形成 computedStyle

## 7. CSS 计算｜specificity的计算逻辑

- CSS 规则根据 specificity 和后来优先规则覆盖
- specificity 是个四元组，越左边权重越高
- 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

## 8. 排版｜根据浏览器属性进行排版

- 采用 flex 为例
- 根据 flex-direction 值的不同区分主轴和交叉轴
- flex-direction:row
  - Main: width, x, left, right
  - Cross: height, y, top, bottom
- flex-direction:column
  - Main: height, y, top, bottom
  - Cross: width, x, left, right

## 9. 排版｜收集元素进行

- 分行
  - 根据主轴尺寸，把元素分进行
  - 若设置了 no-wrap，则强行分配进第一行

## 10. 排版｜计算主轴

- 计算主轴方向
  - 找出所有 flex 元素
  - 把主轴方向的剩余尺寸按比例分配给这些元素
  - 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素

## 11. 排版｜计算交叉轴

- 计算交叉轴方向
  - 根据每一行中最大元素尺寸计算行高
  - 根据行高 flex-align 和 item-align，确定元素具体位置

## 12. 渲染｜绘制单个元素

- 绘制需要依赖一个图形环境
- 这里采用了 npm 包 images
- 绘制在一个 viewport 上进行
- 与绘制相关的属性：background-color、border、background-image 等

## 13. 渲染｜绘制DOM树

- 递归调用子元素的绘制方法完成 DOM 树的绘制
- 忽略一些不需要的节点
- 实际浏览器中，文字绘制是难点，需要依赖字体库，我们这里忽略
- 实际浏览器中，还会对一些图层做 compositing，这里也忽略了

