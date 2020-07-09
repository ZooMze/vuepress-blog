---
title: JavaScript 基础知识点总结
date: 2019-09-24
categories:
 - 基础
 - 备忘
tags:
 - JavaScript
---

为了防止忘记和生疏, 在这篇文章下记录

## 原型 & 原型链

在JavaScript 中, 创建对象是有构造函数来进行创建的, 每个构造函数都有自己的 `prototype` 属性, 这个属性是一个 **对象**, 对象包含了**可由该构造函数产生的所有实例** 共享的属性和方法, 所以当使用构造函数穿件一个新对象后, 在这个新的对象内部包含一个指针, 指向其构造函数的 `prototype` 的值。

```js
var F = function() {}

Object.prototype.a = function(){ console.log('a') }
Function.prototype.b = function(){ console.log('b') }

var f = new F()

f.a()
f.b()

F.a()
F.b()
```

::: details 查看答案

```js
f.a() // >> 'a'
f.b() // >> error

F.a() // >> 'a'
F.b() // >> 'b'
```

:::

`Function` 对象的原型其实指向的是 `Object`