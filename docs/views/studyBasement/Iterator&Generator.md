---
title: 迭代器 Iterator & 生成器 Generator
date: 2020-05-08
categories:
 - 基础
tags:
 - JavaScript
 - ES6
---

在循环遍历数据时, 都需要一个变量来记录每一次迭代在数据集合中的位置, 迭代器就是遍历的另一种解决方案。

**迭代器 (Iterator)** 和 **生成器 (Generator)** 是ES6添加的新内容, **迭代器的使用可以极大地简化数据操作** ; Set集合 与 Map集合 都依赖迭代器的实现,  迭代器的出现旨在消除多重循环时还需要追踪变量所产生的复杂度。

Set 和 Map集合是 ES6提供的新数据结构, [点击这里](./Set&Map) 了解更多。

## 迭代器 Iterator

迭代器是一个特殊对象, 它具有其特有的接口吗所有的迭代器都有 `next()` 方法, 每次调用都会返回一个**结果对象**。

**结果对象**有两个属性: 
* `value` 表示下一个将要返回的值
* `done` (Boolean) 当没有更多可返回的数据时返回 `true`

迭代器还会保存一个内部指针, 用来指向当前集合中的位置, 每当调用一次 `next()`, 都会返回下一个可用的值。

::: warning 注意
如果在最后一个值返回后再调用 `next()` 方法，那么返回的对象中属性 `done` 的值为`true`，属性 `value` 则包含迭代器最终返回的值，这个返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回 `undefined`。
:::

用ES5的语法创建(~~仿造~~)一个迭代器:

```js 
// 迭代器
function createIterator(items) {
  var i = 0;
  return {
    next: function() {
      var done = (i >= items.length);
      var value = !done ? items[i++] : undefined;
      return {
        done: done,
        value: value
      };
    }
  };
}
var iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"
```

在上面这段代码中，`createIterator()` 方法返回的对象有一个 `next()` 方法，每次调用时，`items` 数组的下一个值会作为 `value` 返回。当`i == 3`时，`done` 变为 `true` ; 此时三元表达式会将 `value` 的值设置为 `undefined`。
最后两次调用的结果与ES6迭代器的最终返回机制类似，当数据集被用尽后会返回最终的内容

_上面这个示例很复杂，而在ES6中，迭代器的编写规则也同样复杂，但ES6同时还引入了一个**生成器**对象，它可以让创建迭代器对象的过程变得更简单_

## 生成器 Generator

生成器是一种**返回迭代器的函数**，通过 `function` 关键字后的星号 `*` 来表示，函数中会用到新的关键字 `yield` 。星号可以紧挨着 `function` 关键字，也可以在中间添加一个空格。

```js
// 生成器
function *createIterator() {
  yield 1;
  yield 2;
  yield 3;
}
// 生成器能像正规函数那样被调用，但会返回一个迭代器
let iterator = createIterator();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3
```
在这个示例中，`createlterator()` 前的星号表明它是一个生成器；`yield` 关键字也是ES6的新特性，可以通过它来指定调用迭代器的next()方法时的返回值及返回顺序。生成迭代器后，连续3次调用它的 `next()` 方法返回3个不同的值，分别是1、2和3。生成器的调用过程与其他函数一样，最终返回的是 **创建好的迭代器**。

生成器函数最有趣的部分是，每当执行完一条 `yield;` 语句后函数就会 **自动停止** 执行。举个例子，在上面这段代码中，执行完语句 `yield 1;`之后，函数便不再执行其他任何语句，直到再次调用迭代器的 `next()` 方法才会继续执行 `yield 2;` 语句。生成器函数的这种中止函数执行的能力有很多有趣的应用。

使用 `yield` 关键字可以返回任何值或表达式，所以可以通过生成器函数批量地给迭代器添加元素。例如，可以在循环中使用 `yield` 关键字:

```js
function *createIterator(items) {
  for (let i = 0; i < items.length; i++) {
    yield items[i];
  }
}
let iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"
```

在此示例中，给生成器函数 `createlterator()` 传入一个 `items` 数组，而在函数内部，`for` 循环不断从数组中生成新的元素放入迭代器中，每遇到一个 `yield` 语句循环都会停止；每次调用迭代器的 `next()` 方法，循环会继续运行并执行下一条 `yield` 语句。

生成器函数是ES6中的一个重要特性，可以将其用于所有支持函数使用的地方。

::: danger 警告
`yield` 关键字只可在生成器内部使用，在其他地方使用会导致程序抛出错误
```js {3-4}
function *createIterator(items) {
  items.forEach(function(item) {
    // 语法错误
    yield item + 1;
  });
}
```
从字面上看，`yield` 关键字确实在 `createlterator()` 函数内部，但是它与 `return` 关键字一样，二者都不能穿透 **函数边界**。嵌套函数中的 `return` 语句不能用作外部函数的返回语句，而此处嵌套函数中的 `yield` 语句会导致程序抛出语法错误
:::

## 实例与应用

### 生成器函数表达式

可以通过函数表达式来创建生成器，只需在function关键字和小括号中间添加一个星号(*)即可

```js
let createIterator = function *(items) {
    for (let i = 0; i < items.length; i++) {
        yield items[i];
    }
};
let iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"
```
在这段代码中，`createlterator()` 是一个生成器函数表达式，而不是一个函数声明。由于函数表达式是匿名的，因此星号直接放在 `function` 关键字和小括号之间。此外，这个示例基本与前例相同，使用的也是 `for` 循环

::: danger 警告
**不能用箭头函数来创建生成器**
:::

### 生成器对象的方法

由于生成器本身就是函数，因而可以将它们添加到对象中。下例是通过ES6的函数方法来创建更简洁的生成器:

```js
var o = {
  *createIterator(items) {
    for (let i = 0; i < items.length; i++) {
      yield items[i];
    }
  }
};
let iterator = o.createIterator([1, 2, 3]);
```

### 状态切换器

由于生成器的暂停机制, while并不会造成死循环, 它只在 `next()` 调用时进行激活迭代, 所以可以利用这一机制来完成状态切换:
```js
let state = function*(){
  while(true){
    yield 'A';
    yield 'B';
    yield 'C';
  }
}

let status = state();
console.log(status.next().value);//'A'
console.log(status.next().value);//'B'
console.log(status.next().value);//'C'
console.log(status.next().value);//'A'
console.log(status.next().value);//'B'
...

```

## 内建迭代器

迭代器是ES6的一个重要组成部分，在ES6中，已经默认为许多内建类型提供了内建迭代器，只有当这些内建迭代器无法实现目标时才需要自己创建。通常来说当定义自己的对象和类时才会遇到这种情况，否则，完全可以依靠内建的迭代器完成工作，而最常使用的可能是集合的那些迭代器

在ES6中有3种类型的集合对象：数组、Map集合与Set集合
为了更好地访问对象中的内容，这3种对象都内建了以下三种迭代器:

* `entries()` 返回一个迭代器，其值为多个键值对
* `values()` 返回一个迭代器，其值为集合的值
* `keys()` 返回一个迭代器，其值为集合中的所有键名

### entries()迭代器

每次调用 `next()` 方法时，`entries()` 迭代器都会返回一个数组，数组中的两个元素分别表示集合中每个元素的键与值。如果被遍历的对象是数组，则第一个元素是数字类型的索引；如果是Set集合，则第一个元素与第二个元素都是值(Set集合中的值被同时作为键与值使用)；如果是Map集合，则第一个元素为键名

```js
let colors = [ "red", "green", "blue" ]; //Array

let tracking = new Set([1234, 5678, 9012]); // Set

let data = new Map(); // Map
data.set("title", "Understanding ES6");
data.set("format", "ebook");

for (let entry of colors.entries()) {
    console.log(entry);
}
for (let entry of tracking.entries()) {
    console.log(entry);
}
for (let entry of data.entries()) {
    console.log(entry);
}
```

输出如下:

```js
// Array
[0, "red"]
[1, "green"]
[2, "blue"]
// Set
[1234, 1234]
[5678, 5678]
[9012, 9012]
// Map
["title", "Understanding ES6"]
["format", "ebook"]
```

### values()迭代器

调用 `values()` 迭代器时会返回集合中所存的所有值

```js 
let colors = [ "red", "green", "blue" ];

let tracking = new Set([1234, 5678, 9012]);

let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "ebook");

for (let value of colors.values()) {
    console.log(value);
}
for (let value of tracking.values()) {
    console.log(value);
}
for (let value of data.values()) {
    console.log(value);
}
```

输出如下:

```
"red"
"green"
"blue"

1234
5678
9012

"Understanding ES6"
"ebook"
```

如上所示，调用 `values()` 迭代器后，返回的是每个集合中包含的真正数据，而不包含数据在集合中的位置信息

### keys()迭代器

`keys()` 迭代器会返回集合中存在的每一个键。如果遍历的是数组，则会返回数字类型的键，数组本身的其他属性不会被返回；如果是Set集合，由于键与值是相同的，因此 `keys()` 和 `values()` 返回的也是相同的迭代器；如果是Map集合，则 `keys()` 迭代器会返回每个独立的键

```js
let colors = [ "red", "green", "blue" ];

let tracking = new Set([1234, 5678, 9012]);

let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "ebook");

for (let key of colors.keys()) {
    console.log(key);
}
for (let key of tracking.keys()) {
    console.log(key);
}
for (let key of data.keys()) {
    console.log(key);
}
```

输出结果如下:

```js
0
1
2

1234
5678
9012

"title"
"format"
```

`keys()` 迭代器会获取 `colors` 、`tracking` 和`data` 这3个集合中的每一个键，而且分别在3个 `for-of` 循环内部将这些键名打印出来。对于数组对象来说，无论是否为数组添加命名属性，打印出来的都是数字类型的索引；而 `for-in` 循环迭代的是数组属性而不是数字类型的索引



参考: [ES6中的迭代器(Iterator)和生成器(Generator)](https://www.cnblogs.com/xiaohuochai/p/7253466.html)