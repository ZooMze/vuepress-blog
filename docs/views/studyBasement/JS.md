---
title: JavaScript基础
date: 2020-05-20
categories:
 - 基础
tags:
 - JavaScript
---

## 基础

### call()、apply()、bind()

先看简单的例子:

* 例子1
```JavaScript
var name = '赵', rank = 1
var newGuy = {
  name: '钱',
  hisRank: this,
  func: function () {
    console.log(`${this.name}的排名是${this.rank}`)
  }
}
```

输出结果:

```JavaScript
newGuy.hisRank;  // 1
newGuy.func()  // 钱的排名是undefined
```

* 例子2
```JavaScript
var name = '孙'
function newFunc() {
  console.log(this.name)
}
```

输出结果:

```JavaScript
newFunc()  // 孙
```

比较一下两个例子中的 `this` 指向:
* 例子1 的 `console` 中 `this` 指向: `newGuy`
* 例子2 的 `console` 中 `this` 指向: `window`(没有上下文, 默认window)

**call()、apply()、bind() 都是用来重定义 `this` 的指向**

现在延展一下例子1:

```JavaScript
var name = '赵', rank = 1
var newGuy = {
  name: '钱',
  hisRank: this,
  func: function () {
    console.log(`${this.name}的排名是${this.rank}`)
  }
}
var another = {
  name: '李',
  rank: 4
}
```
输出结果:

```JavaScript
newGuy.func.call(db);    // 钱的排名是4
newGuy.func.apply(db);   // 钱的排名是4
newGuy.func.bind(db)();  // 钱的排名是4
```
**bind()方法返回的是函数, 需要调用才会被执行**

### 闭包

闭包的定义:

**当在函数内部定义了其他函数时候，就创建了闭包。闭包有权访问包含函数内部的所有变量。**

在通常情況下, 一个函数被执行结束后, 函数本身和其自身的内部变量都将会被从内存中释放, 所以外部无法访问

一段简单的代码:
```JavaScript
function myFunc(newName) { 
  var name="ZooMze"
  return (newName) => {
    console.log(name, newName)
  }
} 

myFunc()('new') // ZooMze new
```

以上代码就形成了一个典型的闭包，函数 `myFunc()` 执行之后，在它内部声明的变量 `name` 依然可以使用。

闭包描述了函数执行完毕内存释放后，**依然内存驻留** 的一个现象。

