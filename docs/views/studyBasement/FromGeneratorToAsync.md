---
title: 从 Generator 到 Async
date: 2020-06-12
categories:
 - 基础
tags:
 - JavaScript
 - ES6
---

异步编程的终极解决方案

<!-- more -->

## 前言
JavaScript 是单线程语言, 如果没有异步编程, 那整个执行过程将长的可怕, 甚至可能会直接卡死。

在以往, 异步编程主要体现在下面几种类型:

* **回调函数**
* **事件监听**
* **[发布 / 订阅]()**
* **Promise**
  
ES6的出现, 将异步编程提升到了全新的高度, 异步编程的终极目标就是: **让代码变得更像同步编程**!

## 什么是异步?

<!-- @flowstart
cond=>condition: Process?
process=>operation: Process
e=>end: End

cond(yes)->process->e
cond(no)->e
@flowend -->

将原本一个任务分段, 先执行其中的一段, 然后执行本任务以外的**其他任务**, 等第一段做好了准备, 在回来**本任务**执行第二段, 这种就是异步。

例如一个请求并处理文件, 首先系统请求文件, 请求文件本身是异步任务, 在等待请求完成过程中程序会执行其余的任务, 等到文件请求完成后, 再回来继续执行处理本文件的任务(也就是第二段任务)。

反之, 所有任务都是依次等待的情况就称为 **同步**。

刚刚那个请求文件的例子, 如果没有异步, 则整个程序在文件请求完成之前都是处于等待状态。

## 回调函数

JavaScript 语言对异步编程的实现，就是回调函数。

**所谓回调函数(callback)，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。**

上述的请求文件的例子在异步的代码中就长这样:

```js
// 第二个参数即是 callback函数, 他将在读取文件完成后执行
fs.readFile('/etc/passwd', function (err, data) {
  if (err) throw err;
  console.log(data);
});
```

:::details 康康这个
一个有趣的问题是，为什么 Node.js 约定，回调函数的第一个参数，必须是错误对象 `err`（如果没有错误，该参数就是 `null` ）？原因是执行分成两段，在这两段之间抛出的错误，程序无法捕捉，只能当作参数，传入第二段。
:::

## Promise

回调函数在单个简单任务执行时没毛病, 但是如果嵌套就会使代码非常繁杂, 回调地狱(callback hell)就是描述的这种情况。

Promise的出现就是为了解决这个问题, 他不是新的语法功能, 是回调函数的新的写法, 将回调地狱的横向发展改回纵向发展, 现在我们使用Promise来读取多个文件, 代码大约长这样:

```js
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function(data){
  console.log(data.toString());
})
.then(function(){
  return readFile(fileB);
})
.then(function(data){
  console.log(data.toString());
})
.catch(function(err) {
  console.log(err);
});
```

Promise虽然改进了单纯回调函数横向复杂度的缺点, 但是其本身仍然有缺陷: 原本有语义的任务被一堆 `then()` 包裹, 代码逻辑完全被回调逻辑取代

## 协程的概念

在很多其他编程语言中, 早有异步编程的解决方案, 那就是 **协程**: 多个线程互相协作完成异步任务。

协程的运行流程是这样的:

1. _协程①_ 开始执行
2. _协程①_ 执行到一部分, 暂停, 执行权转交给别的 _协程②_
3. (一段时间后) _协程②_ 转交执行权
4. _协程①_ 恢复执行

我们再回到刚刚得请求文件的例子

```js {3}
function asnycJob() {
  // ...其他代码
  var f = yield readFile(fileA); 
  // ...其他代码
}
```

`asyncJob` 其实就是一个协程, 它在执行了一段后进入暂停阶段(由yield命令转交执行权), 再等到执行权返回时重新继续执行 `yield` 暂停以后的内容, 如此一来, 你的代码如果去掉 `yield`, 它看起来就跟同步代码一模一样!

## Generator

你也可以本站的这篇内容: [迭代器 Iterator & 生成器 Generator](./Iterator&Generator.md) 来了解更多。

```js {2}
function* gen(x){
  var y = yield x + 2; // function will pause here until then next runing
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```

Generator函数 即是协程在ES6的实现, 你如果看了上述的内容，你应该知道Generator是一个生成器, 他是一个特殊的函数, 执行生成器是不会有任何返回结果, 他返回的是一个 迭代器Interator。迭代器再调用 `next()` 方法, 开始执行直到遇到 `yield`, 并返回yield 当前阶段的状态: 

```js
{
  value: '???', // yield 后的表达式的值
  done: true || false // 生成器内的内容是否全部执行结束
}
```

上例中初次执行 `next()` 时遇到了`yield` 并返回了 `x + 2` 的值, 第二次 `next()` 时, 由于是从 `yield` 后开始执行的, `y` 没有任何赋值操作, 所以返回了 `undefined` , `done` 状态也变成了 `true`。

## Generator 的数据接力和错误处理

### 数据接力

迭代器调用 `next()` 其实是可以带参数的, 正常书写异步代码时也应当附带参数, 参数的值表示上一个阶段异步任务( `yield` )的执行结果, 所以你在最开始就给 `next()` 添加参数, 迭代器并不会理会它。

```js
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true } 接替了第一阶段的执行结果, 将值赋给了y
```

### 错误处理

来看这段代码:

```js {12}
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){ 
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了!'); // 出错了! << console from line 5
```

## Generator实践

我们先定义一个生成器:

```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'someURL';
  var result = yield fetch(url); // 获取数据
  console.log(result.bio);
}
```

然后执行它:

```js
var g = gen();
var result = g.next(); // 执行至next()后暂停

// 注意Fetch返回的是Promise对象. 这里需要使用then()
result.value.then(function(data){
  return data.json();
}).then(function(data){ // 完成return后 继续执行, 再打印出console的内容
  g.next(data);
});
```


\* _前文即大致地介绍了Generator的意义的使用方法, 接下来, 就得搬出终极方案: `async` / `await`_

## Async是什么?

**`async` 函数其实就是 Generator 函数的语法糖, 已更加简洁的方式出现在你的代码中。**

现在来把前文提到的的读取多个文件的方法重新用通常的Generator来重新写一下, 就大约是这个亚子:

```js
var fs = require('fs');

// 定义一个异步的Promise用来读取文件
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString()); // 这里其实输出的是function代码而非文件结果
  console.log(f2.toString());
};
```

然后改写成 `async`:

```js
var asyncReadFile = async function (){
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

发现了吗, 其实就是把 `*` 提到前面换成了 `async`, 把 `yield` 换成了 `await` !

## Async的错误处理

`async` 函数返回一个Promise对象, 所以有可能会返回 `reject`, 这时候就需要进行错误处理, 我们使用 `try catch` 进行错误捕捉:

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 或者写得更简单些

async function myFunction() {
  await somethingThatReturnsAPromise().catch(function (err){
    console.log(err);
  });
}
```

::: tip 注意
`await` 命令只能用在 `async` 函数内, 否则会报错, 就跟 (*) 包含了 `yield` 一样。
:::

