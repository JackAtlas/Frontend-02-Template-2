# 第二周 重学JavaScript

## 1. JS 语言通识｜泛用语言分类方法

语言按语法分类

- 非形式语言
  - 中文，英文

- 形式语言（以乔姆斯基谱系为例）
  - 0型 无限制文法
  - 1型 上下文相关文法
  - 2型 上下文无关文法
  - 3型 正规/正则文法（regular）

## 2. JS 语言通识｜什么是产生式

产生式（以BNF 巴科斯-诺尔产生式为例）

- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称终结符
  - 复合结构称非终结符
- 引号和中间的字符表示终结符
- 可以有括号
- * 表示重复多次
- | 表示或
- + 表示至少一次

**例子：**

四则运算：

> 1 + 2 * 3

```
BNF:

<MultiplicativeExpression>::=<Number>|
  <MultiplicativeExpression>"*"<Number>|
  <MultiplicativeExpression>"/"<Number>|
<AddtiveExpression>::=<MultiplicativeExpression>|
  <AddtiveExpression>"+"<MultiplicativeExpression>|
  <AddtiveExpression>"-"<MultiplicativeExpression>|
```

- 终结符：
  - Number
  - +-\*/

- 非终结符：
  - MultiplicativeExpression
  - AddtiveExpression

**练习：编写带括号的四则运算产生式**

## 3. JS语言通识｜深入理解产生式

通过产生式理解乔姆斯基谱系

- 0型 无限制文法
  - `?::=?`

- 1型 上下文相关文法
  - `?<A>?::=?<B>?`

- 2型 上下文无关文法
  - `<A>::=?`

- 3型 正则文法
  - `<A>::=<A>?`
  - `<A>::=?<A>` 错误

JavaScript 总体上是上下文无关文法，个别地方是上下文相关语法，其中表达式部分多是正则文法，也有特例（`**`运算符）。

> `2 ** 1 ** 2` 运行结果是 2，因为 `**` 运算符是右结合。

## 4. JS语言通识｜现代语言的分类

### 现代语言的特例

- C++中，* 可能表示称号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型
- VB中，< 可能是小于号，也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量
- Python中，行首的tab符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent
- JavaScript中，/可能是除号，也可能是正则表达式开头，处理方式类似于VB，字符串模版中也需要特殊处理 }，还有自动插入分号规则

### 语言的分类

- 形式语言——用途
  - 数据描述语言（如 JSON、HTML、XAML、SQL、CSS 等）
  - 编程语言（如 C、C++、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskell、JavaScript 等）

- 形式语言——表达方式
  - 声明式语言（如 JSON、HTML、XAML、SQL、CSS、Lisp、Clojure、Haskell 等）
  - 命令型语言（如 C、C++、Java、C#、Python、Ruby、Perl、JavaScript 等）

**练习：尽可能寻找你知道的计算机语言，尝试把它们分类**

## 5. JS语言通识｜编程语言的性质

### 图灵完备性

- 命令式——图灵机
  - goto
  - if 和 while

- 声明式——lambda
  - 递归

### 动态与静态

- 动态：
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime

- 静态：
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

### 类型系统

- 动态类型系统（运行在用户的内存中，如JavaScript）与静态类型系统（运行在开发人员的内存中，如C++）
- 强类型与弱类型
  - String + Number
  - String == Boolean
- 复合类型
  - 结构体
  - 函数签名
- 子类型
- 泛型
  - 逆变/协变

## JS语言通识｜一般命令式编程语言的设计方式

- Atom
  - Identifier
  - Literal

- Expression
  - Atom
  - Operator
  - Punctuator

- Statement
  - Expression
  - Keyword
  - Punctuator

- Structure
  - Function
  - Class
  - Process
  - Namespace

- Program
  - Program
  - Module
  - Package
  - Library

## 7. JS类型｜Number

### Atom

#### 语法

- Literal
- Variable
- Keywords
- Whitespace
- Line Terminator

#### 运行时

- Types 类型
- Execution Context

### Types

- Number
- String
- Boolean
- Object
- Null（有值为空）
- Undefined（没有定义过值，一般用于检测）
- Symbol（专用于 Object 的属性名）

### Number

IEEE 754 Double Float，双精度浮点类型。浮点数表示小数点是可以来回浮动的，基本思想是把一个数字拆成指数和有效位数。有效位数决定了浮点数表示的精度，位数决定浮点数表示的范围。浮点数可以表示很大的数，但数越大能表示的位数就越稀疏。1位符号位 + 11位指数位 + 52 个精度位。精度位乘以指数位乘以2的指数次方。

- Sign(1)
- Exponent(11)
- Fraction(52)

**语法**

- 十进制
  - 0
  - 0.
  - .2
  - 1e3，科学技术法

- 二进制
  - ob111

- 八进制
  - 0o10

- 十六进制
  - 0xFF

> 一个语法冲突的案例：因为 `0.` 是一个合法的十进制数字，所以 `0.toString()` 会被解析成语法错误，要使 `.` 运算符成立，正确写法是在 `0` 后面加一个空格 `0 .toString()`。

## 8. JS类型｜String

- Character 字符
- Code Point 码点，如 97 代表 a
- Encoding 编码方式

常见的字符集

- ASCII，编码了计算机系统里最常见的 127 个字符，包括 26 个大写字母、26 个小写字母、数字 0 到 9 以及各种制表符、特殊符号、控制字符。
- Unicode，集合了全世界的字符，分片区。
- UCS。
- GB
  - GB2312
  - GBK(GB13000)
  - GB18030
- ISO-8859
- BIG5

GB、ISO-8859、BIG5 都属于一定的国家地区语言的特定的编码格式，互不兼容，也不兼容 Unicode，但兼容 ASCII。

### 编码

UTF8 默认用一个字节（8个比特位）表示一个字符，因此 ASCII 码对应的字符在 UTF8 中的编码是一样的。

UTF16 默认用两个字节（16个比特位）表示一个字符，不足 16 位前面补 0。

汉字的“一”在 UTF16 中的编码是 01001110 00000000。用 UFT8 表示则要 3 个字节，因为要用到控制符，**1110**0100 **10**111000 **10**000000。加粗的地方是控制符，**1110** 表示占 3 个字节，多少个 1 就占多少个字节；后面的每一个字节都会以 **10** 开头。

### 练习

用 UTF8 对字符串进行编码

```javascript
function UFT8_Encoding(string) {
  // return new Buffer()
}
```

### 语法

- 双引号和单引号
- \n 会车、\t tab
- \\\
- 反引号 \``

#### 练习：用正则表达式匹配双引号

```
"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"
```

知识点：

- 空白的定义包含换行（\n）、斜杠（\\）、回到行首（\r）、分段（\u2028）、分页（\u2029）
- \x 转义和 \u 转义

#### 反引号

形如 \`ab\${x}abc`，JavaScript 引擎解析时会拆分成：

- `ab${
- }abc${
- }abc`

## JS 类型｜其他类型

### Boolean

- true
- false

### Null、Undefined

- null
- undefined
- `void 0;` void 一切会得到 undefined

null 是关键字，undefined 是全局变量。

（未完待续）


