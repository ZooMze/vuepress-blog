---
title: Set & Map 数据集合
date: 2020-06-04
categories:
 - 基础
tags:
 - JavaScript
 - ES6
---

# Set & Map 数据集合

## Set

类似于数组 `Array`，但其本身并不是数组 `Array`, 实际上是 **值`Value`的集合**; 其成员的值都是唯一的，没有重复成员。

Set 本身是一个**构造函数**，用来生成 Set集合, 利用其不允许重复的特性, 通常用于简单的数据去重。

```js
let s1 = new Set(); // 空Set
let s2 = new Set([1, 2, 3]); // 1, 2, 3
let s2 = new Set([1, 2, 3, 3]); // 1, 2, 3(重复的value将会自动过滤)
```

Set集合 有如下方法和属性:

| 属性/方法名称 | 描述 |
|:-|:-|
|`add(value)`|向Set中添加成员值|
|`has(value)`|判断值`value`是否存在Set对象中, 返回布尔值|
|`delete(value)`|删除某个成员，删除成功返回`true`, 否则返回`false`|
|`clear()`|清除所有成员，没有返回值|

::: danger 警告
Set集合可以是多维数据, 多维数据时无法直接使用 `has()` 方法判断对象
:::

### Set的遍历

由于不是数组, 并不能直接通过下标进行直接访问成员值, 也无法直接访问其`length`, 实际上访问时是在访问Set的 [内建迭代器](./Iterator&Generator.md#内建迭代器) `entries()` 尽管在浏览器中直接打印Set集合的值看起来是有下标存在的。

Set集合的实例可用如下四个遍历方法:

* `keys()`: 返回键名的迭代器
* `values()`: 返回键值的迭代器
* `entries()`: 返回键值对的迭代器
* `forEach()`: 使用回调函数遍历每个成员

前三个方法返回Set的 [内建迭代器](./Iterator&Generator.md#内建迭代器), 这里说明一下 `forEach`:

```js {5}
let set = new Set([666, 777, 888])

set.keys()

set.forEach(value, key, SetObj) {
  console.log(value) // 键值成员
  console.log(key) // 由于Set对象没有键, 所以与value相同
  console.log(SetObj) // set集合本身
}
```

::: tip 注意
Set集合没有 `length` 属性, 其长度是由 `size` 属性所提供的成员总数
:::



## Map

Map是JavaScript的对象(Object), 即键值对的集合, 但通常的对象仅能使用字符串作为键名 `key`, Map就有所不同。

Map打破了上述的 **键(string)-值** 对应关系, 使得Object的定义更广泛: **值-值**, 也就是说, 各种类型的数据都可以当做键(包括Object):

```js
// 简单的Map集合
let m = new Map([
  [{ a: 1 }, 1],
  ["aa", 2]
  ]);
console.log(m);
```

Map的初始化可以由Map本身和Set函数来进行创建

```js
const set = new Set([
  ['a', 12],
  ['b', 34]
])
const m1 = new Map(set)
const m2 = new Map(m1)
```

Map函数有如下方法

| 属性/方法名称 | 描述 |
|:-|:-|
|`set(key,value)`|更新`key`以及对应的`value`, 如果没有此`key`则添加新的`key`和值, 并返回更新后的整个Map集合, 由于返回的是Map本身, 则可以采用链式写法|
|`get(key)`|获取`key`的对应值`value`, 未找到返回`undefined`|
|`has(key)`|判断键`key`是否存在Map对象中, 返回布尔值|
|`delete(key)`|根据键`key`删除对应的成员，返回`true`。如果删除失败，返回`false`|
|`clear(key)`|清除所有成员，没有返回值|

::: danger 警告
Map集合同样无法直接使用 `has()` 方法判断以对象作为键key的成员
:::

Map可以以Set同样的方式进行[遍历](./Set&Map.md#set的遍历), 不在赘述