---
title: JavaScript的闭包(closure)
date: 2020-06-22
categories:
 - 基础
tags:
 - JavaScript
---

传说中面试必考内容?

<!-- more -->
还是以一个小例子作为引子:

```js {3}
for (var i = 1; i <= 5; i++) {
   setTimeout(function test() {
        console.log(i) // 连续输出五次6
    }, i * 1000);
}
```

其实本意是想依次输出 `1 2 3 4 5`, 结果变成了在最后连续输出了 `6 6 6 6 6`, 这是因为 `test` 函数内的变量 `i` 没有找到在 **当前作用域** 内的已有变量, 于是去寻找 **作用域链** 上的可用变量, 最终找到了 `for` 循环的变量 `i`, 同时由于 `setTimeout` 的延迟机制, 在执行其内部的代码时, `i` 的值早已变为了 `6`。

那么, 要实现我们的本意, 我们对上面的代码利用 **闭包** 进行改造:

```js {2-4,6}
for (var i = 1; i <= 5; i++) {
  (function(j) {//包了一层IIFE形式的函数，这个函数是闭包
    setTimeout(function test() {//函数体内的j引用了外层匿名函数的参数j
      console.log(j); //>> 1 2 3 4 5
    }, j * 1000);
  })(i); // IIFE ends
}
```

再回顾下以上代码发生了什么:

* 匿名IIFE函数暴露了一个参数 `j`, 这个参数的实际只想就是 `for` 循环中 `i`的值, 由于多了一层函数, `setTimeout` 中的 `j` 其实是引用到了他上层匿名IIFE函数的变量 `j`, 这个值就是每次 `for` 循环遍历中的值。

* 每次循环遍历时, `test` 每次都正确的访问到了 `for` 循环中的 `i`, 然后满足了我们的需求, nice~

::: tip 要点
* 闭包一定是 **函数**
* 多嵌套的一层函数, 强制性的修改了作用域
:::

## 什么是闭包?

通过上面改写后的例子, 我们来说说到底啥是闭包:

::: tip 太长不看版:
**内层的作用域访问它外层函数作用域里的参数/变量/函数时，闭包就产生了。**
:::

再次把刚刚那个功能的代码改造一下：

```js {4}
for (var i = 1; i <= 5; i++) {
  let j = i;
  setTimeout(function test() {
    console.log(j) //>> 1 2 3 4 5
  }, j * 1000);
}
```

果然，用 `let` 关键字包上一个作用域，也能和闭包一样解决问题达成目的。因此可以说，**闭包是一种作用域，它拷贝了一套外层函数作用域中被访问的参数、变量/函数，这个拷贝都是浅拷贝**。

## 闭包能带来什么?

变量a类似于高级语言的私有属性，无法被func外部作用域访问和修改，只有func内部的作用域（含嵌套作用域）可以访问。这样可以实现软件设计上的封装，设计出很强大的类库、框架，比如我们常用的jQuery、AngularJS、Vue.js。

```js
//定义一个模块
function module(n) {
  //私有属性
  let name = n;
  //私有方法
  function getModuleName() {
    return name;
  }
  //私有方法
  function someMethod() {
    console.log("coffe1891");
  }
  //以一个对象的形式返回
  return {
    getModuleName: getModuleName,
    getXXX: someMethod
  };
}

let myapp = module("myModule");//定义一个模块
console.log(myapp.getModuleName()); //>> myModule
console.log(myapp.getXXX()); //>> coffe1891
```

## 闭包是完美的吗?

//todo...