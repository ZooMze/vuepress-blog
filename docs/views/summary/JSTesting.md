---
title: JavaScript 基础题精选(共20道)
date: 2019-12-21
categories:
 - 基础
tags:
 - JavaScript
---

## 1.parseInt 与 map()

 写出以下代码的输出值, 并写出解答过程

```js
["1", "11", "111"].map(parseInt)
```

::: details 答案

```js
 [1, NaN, 7]
```

 实际上返回的结果是 [1, NaN, 7] ，因为 parseInt 函数只需要两个参数 parseInt(value, radix) ，而 map 的回调函数需要三个参数 callback(currentValue, index, array)。MDN文档中指明 parseInt 第二个参数是一个2到36之间的整数值，用于指定转换中采用的基数, 即进制。如果省略该参数或其值为0，则数字将以10为基础来解析。如果该参数小于2或者大于36，则 parseInt 返回 NaN。此外，转换失败也会返回 NaN。

现在来分析问题。parseInt("1", 0) 的结果是当作十进制来解析，返回 1；parseInt("2", 1) 的第二个参数非法，返回 NaN；parseInt("3", 2) 在二进制中，"3" 是非法字符，转换失败，返回 NaN。
:::

## 2. 神奇的null

写出以下代码的输出值, 并写出解答过程

```js
[typeof null, null instanceof Object]
```

::: details 答案

```js
["object", false]
```

在MDN关于 null 的文档中也特别指出来了，typeof null 的结果是 "object"，它是ECMAScript的bug，其实应该是 "null"。但这个bug由来已久，在JavaScript中已经存在了将近二十年，也许永远不会修复，因为这牵扯到太多的Web系统，修复它会产生更多的bug，令许多系统无法正常工作。而 instanceof 运算符是用来测试一个对象在其原型链构造函数上是否具有 prototype 属性，null 值并不是以 Object 原型创建出来的，所以 null instanceof Object 返回 false。
:::

## 3. 愤怒的reduce

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
[ [3,2,1].reduce(Math.pow), [].reduce(Math.pow) ]
// A. an error
// B. [9, 0]
// C. [9, NaN]
// D. [9, undefined]
```

::: details 答案

```js
A
```

如果数组为空并且没有提供initialValue， 会抛出TypeError 。如果数组仅有一个元素（无论位置如何）并且没有提供initialValue， 或者有提供initialValue但是数组为空，那么此唯一值将被返回并且callback不会被执行。
:::

## 4. 该死的优先级

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
var val = 'smtg';
console.log('Result is ' + (val === 'smtg') ? 'AAA' : 'BBB');
// A. 'Result is AAA'
// B. 'Result is BBB'
// C. 'Result is'
// D. other...
```

::: details 答案

```js
["object", false]
```

实际上输出 "Something"，因为 + 的优先级比条件运算符 condition ? val1 : val2 的优先级高。
:::

## 5. 神鬼莫测之变量提升

写出`flag`执行完下列代码的最终值, 并写出解答过程

```js
var flag = ''
var name = 'someone';
(function() {
  if (typeof name === 'undefined') {
    var name = 'another one';
    flag = true;
  } else {
    flag = false;
  }
})();
```

::: details 答案

```js
true
```

在 JavaScript中， functions 和 variables 会被提升。变量提升是JavaScript将声明移至作用域 scope (全局域或者当前函数作用域) 顶部的行为。
这意味着你可以在声明一个函数或变量之前引用它，或者可以说：一个变量或函数可以在它被引用之后声明。
回到本题, 不要被外部的name迷惑了, 内部声明的name使得其被提升了, 所以undefined 
:::

## 6. 过滤器魔法

写出`ary`执行完下列代码的最终值, 并写出解答过程

```js
var ary = [0,1,2];
ary[10] = 10;
ary.filter(function(x) {
  return x === undefined;
});
```

::: details 答案

```js
[]
```

filter 为数组中的每个元素调用一次 callback 函数，并利用所有使得 callback 返回 true 或 等价于 true 的值 的元素创建一个新数组。callback 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。那些没有通过 callback 测试的元素会被跳过，不会被包含在新数组中。
:::

## 7. 字符串陷阱

写出下列代码的控制台输出结果, 并写出解答过程

```js
function showCase(value) {
  switch(value) {
    case 'A':
    console.log('Case A');
    break;
    case 'B':
    console.log('Case B');
    break;
    case undefined:
    console.log('undefined');
    break;
    default:
    console.log('default');
  }
}
showCase(new String('A'));
```

::: details 答案

```js
Do not know!
```

在 switch 内部使用严格相等 === 进行判断，并且 new String("A") 返回的是一个对象，而 String("A") 则是直接返回字符串 "A"。你也可以参考MDN中对原始字符串和String对象的区分：
typeof string("A") === "string" 的结果是 true
:::

## 8. 一言难尽的强制转换

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
var a = [0];
if ([0]) {
  console.log(a == true);
} else {
  console.log('oops');
}
// A. true
// B. false
// C. 'oops'
// D. other...
```

::: details 答案

```js
D
```

这个是JavaScript中强制转换的经典案例
当 [0] 需要被强制转成 Boolean 的时候会被认为是 true。所以进入第一个 if 语句，而 a == true 的转换规则在ES5规范的第11.9.3节中已经定义过，你可以自己详细探索下。

规范指出，== 相等中，如果有一个操作数是布尔类型，会先把他转成数字，所以比较变成了 [0] == 1；同时规范指出如果其他类型和数字比较，会尝试把这个类型转成数字再进行宽松比较，而对象（数组也是对象）会先调用它的 toString() 方法，此时 [0] 会变成 "0"，然后将字符串 "0" 转成数字 0，而 0 == 1 的结果显然是 false。
:::

## 9. ==

写出下列代码的执行结果, 并写出解答过程

```js
{} == {}
```

::: details 答案

```js
false
```

ES5规范11.9.3.1-f指出：如果比较的两个对象指向的是同一个对象，就返回 true，否则就返回 false，显然，这是两个不同的对象。
:::

## 10. 到底是加还是减

写出下列代码的执行结果, 并写出解答过程

```js
1 + - + + + - + 1
```

::: details 答案

```js
2
```

这个只能出现在示例代码中，如果你发现哪个疯子写了这个在生产代码中，打死他就行了。你只要知道 + 1 = 1和- 1 = -1，注意符号之间的空格。两个减号抵消，所以最终结果等效于 1 + 1 = 2。或者你也可以在符号之间插入 0 来理解，即 1 + 0 - 0 + 0 + 0 + 0 - 0 + 1，这样你就一目了然了吧！千万别写这样的代码，因为可能会被打死！
:::

## 11. 淘气的map

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
var ary = Array(3);
ary[0] = 2;
ary.map(function(elem) {
  return "1";
});

// A. [2, 1, 1]
// B. ["1", "1", "1"]
// C. [2, "1", "1"]
// D. other...
```

::: details 答案

```js
D
```

实际上结果是 ["1", undefined x 2]，因为规范写得很清楚：

map 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值组合起来形成一个新数组。 callback 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。
:::

## 12. 统统算我的

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
function changeArray(ary) {
  ary[1] = ary[0];
}

function func(a, b, c) {
  a = 10;
  changeArray(arguments);
  return a + b + c;
}

func(1, 1, 1);

// A. 3
// B. 11
// C. 12
// D. other...
```

::: details 答案

```js
D
```

实际上结果是 21。
在JavaScript中，参数变量和 arguments 是双向绑定的。改变参数变量，arguments 中的值会立即改变；而改变 arguments 中的值，参数变量也会对应改变。
:::

## 13. 最小的正值

写出下列代码的执行结果, 并写出解答过程

```js
Number.MIN_VALUE > 0
```

::: details 答案

```js
true
```

MIN_VALUE属性是 JavaScript 里最接近 0 的正值，而不是最小的负值。
:::

## 14. 谨记优先级

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
[1 < 2 < 3, 3 < 2 < 1]

// A. [true, true]
// B. [true, false]
// C. [false, true]
// D. [false, false]
```

::: details 答案

```js
A
```

`<`和`>`的优先级都是从左到右，所以 `1 < 2 < 3` 会先比较 `1 < 2`，这会得到 `true`，但是 `<` 要求比较的两边都是数字，所以会发生隐式强制转换，将 `true` 转换成 `1`，所以最后就变成了比较 `1 < 3`，结果显然为 `true`。同理可以分析后者
:::

## 15. 坑爹中的战斗机

写出下列代码的执行结果, 并写出解答过程

```js
2 == [[[2]]]
```

::: details 答案

```js
A
```

如果比较的两个值中有一个是数字类型，就会尝试将另外一个值强制转换成数字，再进行比较。

而数组强制转换成数字的过程会先调用它的 toString方法转成字符串，然后再转成数字。所以 [2]会被转成 "2"，然后递归调用，最终 [[[2]]] 会被转成数字 2
:::

## 16. 小数点魔术

以下三行代码每个分开独立执行, 没有干扰, 请以此说出代码的执行结果, 并写出解答过程

```js
console.log(6.toString())

console.log(666..toString())

console.log(666...toString())
```

::: details 答案

```js
error, "666", error
```

点运算符会被优先识别为数字常量的一部分，然后才是对象属性访问符。所以 6.toString() 实际上被JS引擎解析成 (6.)toString()，显然会出现语法错误。但是如果你这么写 (6).toString()，人为加上括号，这就是合法的
:::

## 17. 自动提升为全局变量

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
(function() {
  var x = y = 1;
})();
console.log(y);
console.log(x);

// A. 1, 1
// B. error, error
// C. 1, error
// D. other...
```

::: details 答案

```js
C
```

很经典的例子，在函数中没有用 var 声明变量 y，所以 y 会被自动创建在全局变量 window下面，所以在函数外面也可以访问得到。而 x 由于被 var 声明过，所以在函数外部是无法访问的。
:::

## 18. 替换陷阱

写出下列代码的执行结果, 并写出解答过程

```js
"1 2 3".replace(/\d/g, parseInt);
```

::: details 答案

```js
"1 NaN 3"
```

如果 replace 方法第二个参数是一个函数，则会在匹配的时候多次调用，第一个参数是匹配的字符串，第二个参数是匹配字符串的下标。所以变成了调用 parseInt(1, 0)、parseInt(2, 2)和parseInt(3, 4)，结果你就懂了。
:::

## 19. 最熟悉的陌生人

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
var a = new Date("2020-03-19");
var b = new Date(2020, 03, 19);
[a.getDay() == b.getDay(), a.getMonth() == b.getMonth()]

// A. [true, true]
// B. [true, false]
// C. [false, true]
// D. [false, false]
```

::: details 答案

```js
D
```

当Date作为构造函数调用并传入多个参数时，如果数值大于合理范围时（如月份为13或者分钟数为70），相邻的数值会被调整。比如 new Date(2013, 13, 1)等于new Date(2014, 1, 1)，它们都表示日期2014-02-01（注意月份是从0开始的）。其他数值也是类似，new Date(2013, 2, 1, 0, 70)等于new Date(2013, 2, 1, 1, 10)，都表示时间2013-03-01T01:10:00。

此外，getDay 返回指定日期对象的星期中的第几天（0～6），所以，你懂的。
:::

## 20. 正则的隐式转换

根据以下代码输出结果选择正确的答案, 并写出解答过程

```js
if("http://giftwrapped.com/picture.jpg".match(".gif")) {
  console.log("a gif file");
} else {
  console.log("not a gif file");
}

// A. "a gif file"
// B. "not a gif file"
// C. error
// D. other...
```

::: details 答案

```js
A
```

match方法如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj)
将其转换为正则表达式对象。
:::
