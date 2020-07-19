# 第三周 重学JavaScript

## 6. JS结构化｜宏任务和微任务

JS执行粒度（运行时）

- 宏任务
- 微任务（Promise）
- 函数调用（Execution Context）
- 语句/声明（Completion Record）
- 表达式（Reference）
- 直接量/变量/this

宏任务和微任务的区分，此处采用了JSC的说法，在不同的 JavaScript 引擎命名可能不同。宏任务就是传给 JavaScript 引擎的任务，微任务就是 JavaScript 引擎内部的任务。宏任务是我们去讨论 JavaScript 语言的最大粒度的范围，微任务是由 Promise 产生的。微任务里可能会分为几层不同的函数调用。

### 宏任务与微任务

举例，让 JavaScript 引擎执行以下一段代码：

```javascript
var x = 1;
var p = new Promise(resolve => resolve());
p.then(() => x = 3);
x = 2;
```

JavaScript 执行这段代码时会产生两个异步任务：

```javascript
x=1
p=...
x=2
```

```javascript
x=3
```

这两个异步代码称为 MicroTask，在 JavaScript 标准里叫做 job。最终的运行结果是 3。把代码交给引擎并让之执行的过程称为 MacroTask。

### 事件循环

事件循环（event loop）这个词本身来自 node 里面的概念，浏览器里有类似的东西但一般的资料不会叫这个名字。事件循环的概念可以分成三个部分，获取代码、执行代码、等待，三者循环。等待的可能是时间或者事件，在 OC 里会把它实现成等待一个锁，由不同的条件触发。事件循环会在一个独立的线程里面执行。

## 7. JS结构化｜JS函数调用

示例一：

```javascript
import {foo} from 'foo.js'
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
```

`foo` 函数如下：

```javascript
function foo() {
	console.log(i);
}
export foo;
```

运行结果：`foo` 函数里访问不到 i。

示例二：

```javascript
import {foo} from 'foo.js';
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
```

`foo` 函数如下：

```javascript
import {foo2} from 'foo2.js'
var x = 1;
function foo() {
	console.log(x);
	foo2();
	console.log(x);
}
export foo;
```

`foo2` 函数如下：

```javascript
var y = 2;
function foo2() {
	console.log(y);
}
export foo2;
```

运行结果：

```javascript
// 模拟执行顺序的伪代码
var i = 0;
console.log(i);
console.log(x);
console.log(y);
console.log(x);
console.log(i);
i++;
```

这样对称的结构反映出一种栈式的关系。函数调用本身会形成一个栈（Execution Context Stack，执行上下文栈），里面的每一项成为一个（Execution Context，执行上下文）。栈顶元素即当前的执行上下文称为 Running Execution Context，当前语句能访问到的所有变量都是从这个执行上下文中获取。

执行上下文的可能含有 7 种字段，但没有任何一个执行上下文是 7 种齐全的。

- code evaluation state，表示代码执行进度的信息，可用于 async 和 generator 函数
- Function
- Script or Module
- Generator，储存 Generator 函数产生的 Generator
- Realm，保存所有使用的内置对象，后文详解。
- LexicalEnvironment，保存变量的环境，后文详解。
- VariableEnvironment，var 声明变量的环境，后文详解。

### LexicalEnvironment

在老版本里只存变量，ES2018 后的标准里所有执行时用到的都会保存到其中。

- this
- new.target 所创造的 Object
- super
- 变量

### VariableEnvironment

是个历史包袱，仅用于处理 var 声明。

一般来说，函数的 body 被预处理的时候就把 var 声明给处理掉了，但如果这个 var 声明是出现在 eval 里面就没办法通过预处理去识别，因此专门用 VariableEnvironment 来处理。除此之外的多数时候 VE 和 LE 是重合的。

示例代码：

```javascript
{
	let y = 2;
	eval('var x = 1;');
}

with ({a:1}) {
	eval('var x;');
}

console.log(x);
```

示例代码中的 `let y = 2;` 会把 y 声明到代码块的作用域里，`eval('var x = 1;');` 会把这个 `x = 1` 声明到更大的作用域里。用 with 来声明的变量会穿过 with 到更大的作用域里。

### Environment Record

环境并不是一个类似池子的概念，而是形成一个链式结构，其中的每一个节点称为一个 Environment Record。Environment Record 的类型有一个继承关系。

- Environment Records
	- Global Environment Records
	- Object Environment Records（给 with 用的）
	- Declarative Environment Records
		- Function Environment Records
		- Module Environment Records

### Function - Closure

在 JavaScript 里每一个函数会生成一个闭包。根据经典定义闭包分为代码部分和环境部分。环境部分由一个 object 和一个变量序列组成。在 JavaScript 里每一函数都会带一个它定义时所在的 Environment Record，将其保存在自己的函数对象上，作为一个属性。

```javascript
var y = 2;
function foo2() {
	console.log(y);
}
export foo2;
```

在上例中，foo2 定义时外边有一个 `y = 2`，不管这个 foo2 最后通过参数或者 export 传到哪，它的 Environment Record 里始终都存在 `y:2` 这条记录。这是 Environment Records 能形成链的关键。

另一个例子：

```javascript
var y = 2;
function foo2() {
	var z = 3;
	return () => {
		console.log(y, z)
	}
}
var foo3 = foo2();
export foo3;
```

foo2 的 ER 里有一条记录 `y:2`。foo3 的 ER 里有两条记录 `z:3` 和 `this:global`。foo2 的 ER 是 foo3 ER 的上级，形成链式的结构。在 ES2018 以前的版本中称为 scope chain，此名现已废弃。由于箭头函数的引入，不但 `z:3` 被保存了下来，`z = 3` 执行时所用的 `this: global` 也被保存了下来。在这个箭头函数里可以同时访问 y、z 和 this。这就是闭包和作用域链的机制。

### Realm

