---
title: Array 的高阶函数
date: 2018-07-22
categories:
 - 基础
 - 备忘
tags:
 - JavaScript
 - ES6
---

## 1、forEach(遍历)

`forEach()` 方法用于调用数组的每个元素，并将元素传递给回调函数。(没有返回值，将数组遍历)

::: warning 注意
`forEach()` 对于空数组是不会执行回调函数的。
:::

__回调函数参数__：`currentValue`  必需。当前元素； `index`  可选。当前元素的索引值； `arr`  可选。当前元素所属的数组对象。

## 2、filter(过滤，返回新数组)

`filter()` 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。

::: warning 注意

* `filter()` 不会对空数组进行检测。
* `filter()` 不会改变原始数组。
:::

__回调函数参数__：`currentValue` 必需。当前元素；`index` 可选。当前元素的索引值；`arr` 可选。当前元素所属的数组对象。

## 3、map(映射，返回新数组)

`map()` 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。

`map()` 方法按照原始数组元素顺序依次处理元素。

::: warning 注意

* `map()` 不会对空数组进行检测。
* `map()` 不会改变原始数组。
:::

__回调函数参数__：`currentValue`  必需。当前元素； `index`  可选。当前元素的索引值； `arr`  可选。当前元素所属的数组对象。

```js
var numbers = [65, 44, 12, 4];
console.log(numbers.map(function(item){
  return item * 10;
}))
//输出[650,440,120,40]
用es5手动实现一下
(function(){
  function myMap(cb, obj){
    // map()不会对空数组进行检测
    if(this.length == 0) return;
      //不改变原数组，不暴露原数组给调用者
    var _this = this.slice();
    var arr = [];
    //如果第二个参数没传，默认是全局对象
    obj ? null : obj = window;
    for(var i=0; i<_this.length; i++){
      arr.push(cb.call(obj, _this[i], i, _this));
    }
    return arr;
  }
  Array.prototype.myMap = myMap;
})();
```

## 4、some(判断是否含有符合条件的元素，返回布尔值)

`some()` 方法用于检测数组中的元素是否满足指定条件（函数提供）。

`some()` 方法会依次执行数组的每个元素：

如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
如果没有满足条件的元素，则返回false。

::: warning 注意

* `some()` 不会对空数组进行检测。
* `some()` 不会改变原始数组。
:::

__回调函数参数__：`currentValue`  必需。当前元素； `index`  可选。当前元素的索引值； `arr`  可选。当前元素所属的数组对象。

```js
var ages = [3, 10, 18, 20];

console.log(ages.some(function(item){
  return item > 28;
}))
//输出false
```

## 5、every(判断是否全部元素符合条件，返回布尔值)

`every()` 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

`every()` 方法使用指定函数检测数组中的所有元素：

如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。

::: warning 注意

* `every()` 不会对空数组进行检测。
* `every()` 不会改变原始数组。
:::

__回调函数参数__：`currentValue`  必需。当前元素； `index`  可选。当前元素的索引值； `arr`  可选。当前元素所属的数组对象。

```js
var ages = [32, 33, 16, 40];
console.log(ages.every(function(item){
  return item > 18;
}))
//输出false
```

## 6、reduce(累加)

`reduce()` 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

`reduce()` 可以作为一个高阶函数，用于函数的 compose。

::: warning 注意
`reduce()` 对于空数组是不会执行回调函数的。
:::

__回调函数参数__：`total`  必需。初始值, 或者计算结束后的返回值； `currentValue` 必需。当前元素； `index`  可选。当前元素的索引值； `arr`  可选。当前元素所属的数组对象。

```js
var arr = [{price:30,count:2},{price:40,count:3},{price:50,count:5}];
//当数组元素为引用类型时需要注意
var sum = arr.reduce(function(x,y){
  return x.price*x.count + y.price*y.count;
})
console.log(sum)
//输出NaN
//正确应该为
var sum = arr.reduce(function(x,y){
  return x + y.price*y.count;
},0)
console.log(sum)
//输出430
用es5手动实现一下
(function(){
  function myReduce(cb, initValue){
    //不对空数组进行检测
    if(this.length == 0) return;
    //不改变原数组，不暴露原数组给调用者
    var arr = this.slice();
    var startIndex = 1;
    //如果有传第二个参数，则从索引为0开始遍历，否则initValue = arr[0]从索引为1开始遍历
    initValue ? startIndex = 0 : initValue = arr[0];
    for(var i=startIndex; i<arr.length; i++){
      initValue = cb(initValue, arr[i], i, arr);
    }
    return initValue;
  }
  Array.prototype.myReduce = myReduce;
})();
```
