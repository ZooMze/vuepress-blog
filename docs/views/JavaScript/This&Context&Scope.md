---
title: 执行上下文、作用域、this
date: 2019-06-09
categories:
 - 基础
 - 备忘
tags:
 - JavaScript
 - ES6
---

这三个东西, 眼熟, 但是吧经常是就知道个大概, 掌握得不够深刻, 本篇文章就来一并全给总结到位!

## 作用域

::: tip 什么是作用域
**函数或变量的可见区域**
如果函数或变量不在此区域内, 则无法访问
:::

```js
(function func(){// 作用域A
  var a = "a"
  var c = 'c'
  function func1(){ //作用域B
    var a = "aa" // 这里覆盖了a原本的值
    var b = "b"

    console.log(a);
  }
  function func2 () { // 作用域C
    console.log(c)
  }

  console.log(a) // >> `a`
  func1()        // >> `aa`
  func2()        // >> `c`
})()
```

这里能输出c是因为作用域链的关系, 是有**作用域链**的存在, 当前作用域如果没有能访问的变量或函数, 则回去上层作用域查询, 这里 `func2` 就在 `func` 内找到了变量 `c`

### 块级作用域

ES6 引入了块级作用域这个概念, 意味着代码之前区分会更加直观直白, 并且不用担心var 的变量提升和变量污染的问题

::: tip 什么是块级作用域
**在某个花括号对 `{ }` 的内部用 `let` 关键字生声明的变量和函数拥有块级作用域**

块级作用域 和 函数作用域 也可以统称为局部作用域
:::

出于向后（backward）兼容的考虑，在块级作用域中声明的函数依然可以在作用域外部引用来看几个例子对比

```js
{
  function func() {//函数声明
    return 1;
  }
}
console.log(func());//>> 1
```

```js
{
  var func = function() {//未使用let关键字的函数表达式
    return 1;
  }
}
console.log(func());//>> 1
```

上面两个都能正确访问代码块内的函数, 要怎么做到真正的块级作用域咧? 用let就完事了

```js
{
  let func = function() {
    return 1;
  }
}
console.log(func());//>> func is not defined
```

## 执行上下文

**当前JavaScript代码被解析和执行时所在的环境，也叫作执行环境,执行上下文是用于跟踪代码的运行情况**。

JS代码在执行前，JavaScript引擎总要做一番准备工作，这份工作其实就是创建对应的执行上下文

### 上下文分类

执行上下文只有三类:

* **全局**执行上下文

全局执行上下文 **只有一个**, 它在客户端中一般由浏览器创建, 也就是window对象, window对象内置了大量方法以及属性, 由于是全局的, 所以在任意位置都能访问到window对象; 同时window还是各种var声明的 **全局对象** 的载体。

* **函数**执行上下文

函数执行上下文可以有 **无数个**, 每当函数被调用, 就会为其生成一个上下文, 同一个函数执行多次, 依然会再次创建新的执行上下文, 由于函数执行上下文有非常多, 那么JavaScript是如何管理这么多执行上下文的呢?

* eval执行上下文 (这个几乎不会用, 本文就不讨论了)

在一个JavaScript程序中，必定会产生多个执行上下文，JavaScript引擎就会以 **堆栈** 的方式来处理它们。**栈底永远都是全局上下文**，而栈顶就是当前正在执行的上下文。

### 执行栈

还是先上个例子, 这里有多个函数, 它们嵌套执行:

```js
function f1() {
  f2();
  console.log(1);
};

function f2() {
  f3();
  console.log(2);
};

function f3() {
  console.log(3);
};

f1(); // 这里应该输出什么呢?
```

::: details 输出结果
依次输出 `3 2 1`
:::

为什么会产生这个现象, JS难道不是按顺序执行吗? 这里就是 **执行栈** 在起作用, 执行栈管理了多个函数执行上下文的顺序

#### 执行上下文的执行

执行栈也叫做调用栈, 既然是栈, 那他就拥有后进先出 (LIFO: Last In First Out) 的特性, 以刚刚的例子来说, 我们来重新模拟执行上下文的**执行阶段**:

1. `f1()` 入栈, 开始执行, 发现了`f2()`, 将其入栈 // 此时 `console.log(1)` 并未入栈
2. `f2()` 入栈, 开始执行, 发现了`f3()`, 将其入栈 // 此时 `console.log(2)` 并未入栈
3. `f3()` 入栈, 开始执行, **`console.log(3)` 入栈并执行**
4. `f3()` 执行完毕, `f3()` 出栈, 继续执行 `f2()` 余下的内容, **`console.log(2)` 入栈并执行**
5. 至此`f2()` 执行完毕, `f2()` 出栈, 继续执行 `f1()` 余下的内容, **`console.log(1)` 入栈并执行**
6. 至此`f1()` 执行完毕, `f1()` 出栈

下面再回过头来说比较难以理解的 **创建阶段**:

#### 执行上下的创建

执行上下文的创建分为三步:

1. 确定this (This Binding)
2. 创建词法环境组件 (LexicalEnvironment)
3. 创建变量环境组件 (VariableEnvironment)

这里用伪代码先描述一下这三步:

```js
ExecutionContext = {  
  // 确定this
  ThisBinding = <this value>,
  // 创建词法环境组件
  LexicalEnvironment = {},
  // 创建变量环境组件
  VariableEnvironment = {},
}
```

##### 确定this

在这一步确定this的指向, 我们知道 this 的指向是当前调用的环境决定的, 可以看 [这个例子](./../summary/OriginalJavaScript.md), 所以这一步就是在准确地确定this到底指向谁

简单说一下, 如果被一个对象调用, 则this指向该对象, 否则通常指向window(严格模式下是undefined)

下一节, 会更详细地介绍 this

##### 词法环境组件

词法环境氛围两类: **全局环境组件** 和 **函数环境组件**

本小节内容较难理解, 通过伪代码来演示

```js
// 全局环境
GlobalExectionContext = {
  // 全局词法环境
  LexicalEnvironment: {
    // 环境记录
    EnvironmentRecord: {
      Type: "Object", //类型为对象环境记录
      // 标识符绑定在这里
    },
    outer: < null >
  }
};
// 函数环境
FunctionExectionContext = {
  // 函数词法环境
  LexicalEnvironment: {
    // 环境纪录
    EnvironmentRecord: {
      Type: "Declarative", //类型为声明性环境记录
      // 标识符绑定在这里
    },
    outer: < Global or outerfunction environment reference >
  }
};
```

看不懂其实也没关系, 这篇文章重点也不在这里, 只需要知道有这么一步是在创建这两个环境就行, 并且发现了吗, 全局环境在函数环境之前被创建好

##### 变量环境组件

变量环境可以说也是词法环境，它具备词法环境所有属性，一样有环境记录与外部环境引入。**在ES6中唯一的区别在于 词法环境 用于存储函数声明与let const声明的变量，而 变量环境 仅仅存储var声明的变量**。

由于这部分太过复杂, 且属于仅了解的知识, 这里只贴出链接参考: [词法环境](https://www.cnblogs.com/yiyi17/p/8630957.html)

## this

本文的重头戏来了, 先从源头说起

### 为什么会有this这个东西

如果没有this存在的话, 当你在一个对象中访问本对象的其他属性时, 是不是得这么写:

```js
var aLongLongLongNameObject = {
  a: 'text',
  func1() {
    return aLongLongLongNameObject.a // 名字太长了, 蓝瘦
  }
}

aLongLongLongNameObject.func1() // >> 'text'
```

又或者是在多个作用域中, 存在着同名的变量:

```js
var aLongLongLongNameObject = {
  a: 'text'
}

(function() {
  var aLongLongLongNameObject = {
    a: 'anotherText',
    func1() {
      // 这里重名了
      return aLongLongLongNameObject.a
    }
  }
})() // >> 'anotherText'
```

`func1()` 里的变量和全局变量重名了, 但由于作用域的分隔, 这就导致阅读代码时如果没有仔细阅读时会产生歧义

于是 this 应运而生, 它指向函数**调用位置的对象**, 承载了当前调用对象本身所有的内容(例如在window中调用则承载了window本身)

::: warning 调用位置是关键!
想要弄清this到底指向谁, 正确的方式是分析函数调用的位置
:::

### 误区

上一节反复提到了调用位置的对象, 是的这是this的常见误区, this **不指向函数自身或是作用域**。

::: warning 要点

* this 在函数被调用时就被确定好了!
* this 与本函数在何处定义无关!
* this 是在执行上下文创建时被确定了, 所以无法再次更改
:::

### 指向规则

前面也有提到通常情况下, 未直接指定调用位置对象的函数, 指向window, 这儿还有一些例外, 比如 `setTimeout` / `setInterval`

`setTimeout` 调用的代码运行在与所在函数完全分离的执行环境上。这会导致这些代码中包含的 `this` 关键字会指向 `window` (或全局)对象。因此通常这两个的函数的内普通回调函数的 this 指向 window

当然也可以通过箭头函数进行修改指向, 但要注意, 箭头函数继承执行上下文的环境, 但是一旦创建好后, 其this 指向就被确定为上一个执行上下文, 并不会由于调用位置而发生变化, 本文后续会通过例子来说明箭头函数相关的内容

```js
var num = 0

class Obj {
  constructor(num) {
    this.num = num
  }
  func() {
    console.log(`print - ${this.num}`)
  }
  func1() {
    setTimeout(function() {
      console.log(`setTimeout - ${this.num}`)
    }, 1000)
  }
  func2() {
    setInterval(function() {
      console.log(`setInterval - ${this.num}`)
    }, 1000)
  }
}

var obj = new Obj(1)

obj.func()  // >> print - 1
obj.func1() // >> setTimeout - 0
obj.func2() // >> setInterval - 0 , setInterval - 0 , setInterval - 0 ...
```

### 迷惑行为大赏

this的指向有时候确实会让人迷惑, 这里还有几个迷惑的例子来帮你了解更多相关内容

#### 被忽略的this

当在借用方法时, `call` / `apply` / `bind` 时, 如果将this指定为 `null` 或者 `undefined`, 那么这个值会被忽略, 然后this将会指向window

```js
function func() {
  console.log(this.a)
}

var a = 2
func.apply(null) // >> 2
```

#### 隐式丢失

```js
function func() {
  console.log(this.a)
}

var a = '1'
var obj = {
  a: '2'
  func: func
}

var newFunc = obj.func

newFunc() // >> '1'
```

不是说好在哪里调用 this 就是谁吗, 怎么又跑到 window 上去了? 确实是如此, 这里 `newFunc` 实际上是引用了 `obj.func`, `obj.func` 还是引用, 所以最本质都是在引用 `func` 这个函数, 既然是引用函数, 那就看这个函数最终在哪里执行, 很显然 `newFunc` 是在全局环境下执行的, 所以此时 this 指向 window

再来一个更迷惑的:

```js
function func() {
  console.log(this.a)
}

var a = '1'
var obj1 = {
  a: '2',
  func: func
}

var obj2 = {
  a: '3'
}
(obj2.func = obj1.func)() // >> '1'
```

这里是有个隐藏知识点, 就是**赋值语句是有返回的, 返回被赋值的内容**; 根据上面的引用原则, 这里是返回的 `func` 函数的引用, 所以相当于还是在 window 环境下直接调用 `func`

#### 箭头函数

现在来填刚刚之前的坑: 箭头函数内this指向

当你定义一个箭头函数时, 箭头函数内的this指向当前箭头函数所处函数的this, 即箭头函数父函数的this

箭头函数的出现干扰了以往的this的指向模式, ES5之前, this是在创建执行上下文的时候(也就是函数执行)就确定; 而箭头函数则是在这个函数被创建出来就确定了(即函数执行之前), 并且一旦创建就不能再修改了

来看这个例子:

```js
function func() {
  return () => {
    console.log(this.a)
  }
}

var a = '1'
var obj1 = {
  a: '2'
}

var obj2 = {
  a: '3'
}

var bar = func.call(obj1) // 在这一步函数已被创建好, this已确定
bar.call(obj2); // >> '2'

// 同样的, 下面的代码也不会输出 '3'
var foo = func() // 在这一步函数已被创建好, this已确定
foo.call(obj2) // >> '1'
```
