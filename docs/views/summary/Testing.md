---
title: JavaScript 基础题精选(共20道)
date: 2020-05-20
categories:
 - 基础
tags:
 - JavaScript
---
# JavaScript 基础题精选(共20道)

## parseInt 与 map()
1. 写出以下代码的输出值, 并写出解答过程
```JavaScript
  ["1", "11", "111"].map(parseInt)
```
::: details 答案
```js
 [1, NaN, NaN]
```
:::

## 2. 写出以下代码的输出值, 并写出解答过程
```JavaScript
  [typeof null, null instanceof Object]
```

## 3. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
  [ [3,2,1].reduce(Math.pow), [].reduce(Math.pow) ]
  // A. an error
  // B. [9, 0]
  // C. [9, NaN]
  // D. [9, undefined]
```

## 4. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
  var val = 'smtg';
  console.log('Result is ' + (val === 'smtg') ? 'AAA' : 'BBB');
  // A. 'Result is AAA'
  // B. 'Result is BBB'
  // C. 'Result is'
  // D. other...
```

## 5. 写出`flag`执行完下列代码的最终值, 并写出解答过程
```JavaScript
  var flag = ''
  var name = 'someone';
  (function () {
    if (typeof name === 'undefined') {
      var name = 'another one';
      flag = true;
    } else {
      flag = false;
    }
  })();
```

## 6. 写出`ary`执行完下列代码的最终值, 并写出解答过程
```JavaScript
  var ary = [0,1,2];
  ary[10] = 10;
  ary.filter(function(x) {
    return x === undefined;
  });
```

## 7. 写出下列代码的控制台输出结果, 并写出解答过程
```JavaScript
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

## 8. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
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

## 9. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  {} == {}
```

## 10. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  666 + - + + + - + 666
```

## 11. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
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

## 12. 根据以下代码输出结果选择正确的答案, 并写出解答过程
``` JavaScript
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

## 13. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  Number.MIN_VALUE > 0
```

## 14. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
  [1 < 2 < 3, 3 < 2 < 1]

  // A. [true, true]
  // B. [true, false]
  // C. [false, true]
  // D. [false, false]
```

## 15. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  2 == [[[2]]]
```

## 16. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  console.log(6.toString())
  console.log(666..toString())
  console.log(666...toString())
```

## 17. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
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
## 18. 写出下列代码的执行结果, 并写出解答过程
```JavaScript
  "1 2 3".replace(/\d/g, parseInt);
```

## 19. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
  var a = new Date("2014-03-19");
  var b = new Date(2014, 03, 19);
  [a.getDay() == b.getDay(), a.getMonth() == b.getMonth()]

  // A. [true, true]
  // B. [true, false]
  // C. [false, true]
  // D. [false, false]
```

## 20. 根据以下代码输出结果选择正确的答案, 并写出解答过程
```JavaScript
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