---
title: 节流 Throttle
date: 2020-07-08
categories:
 - 备忘
 - 教程
tags:
 - JavaScript
---

## 前言

上一篇说到 [防抖 Debounce](./Debounce.md), 对于性能优化还有另一种方案: 那就是本篇内容介绍的 节流 Throttle, 节流与防抖有着共同的目的, 都是防止事件一直触发, 但是他们存在着根本上的差异, 一个是直接阻止, 一个是减少数量。

## 节流的定义

同防抖一样, 都是用来处理连续的事件触发, 但是节流是按照单位时间 n 秒进行限制, 以 n 秒为间隔来触发事件。

意思就是说在这 n 秒内允许触发有且只有 1 次, 想要再次触发得等下一个 n 秒开始!

这里要考虑一下边缘情况: 首次是否执行? 计时结束后是否还要再执行一次?

这里可以用两个布尔变量来控制这种情况:

* `lead` 首次是否执行
* `tail` 结束后是否在执行一次

提到时间, 你是不是又想到了防抖里用过的 `setTimeout` 了? 那么我们就从定时器的实现开始

## 定时器的实现

思路很简单: 创建一个定时器, 如果再次有同样的的事件触发, 则根据计时器的情况决定是否能继续执行, 然后直到定时器计时结束, 清空计时器, 等待下一次事件触发:

```js {14-20}
var container = document.getElementsByTagName('body')[0]
var count = 1

function getUserAction() {
  console.log(`这是第${count++}次调用这个事件了!`);
}

function throttle(func, wait) {
  var timeout

  return function() {
    var context = this
    var args = arguments
    if(!timeout) {
      timeout = setTimeout(function() {
        timeout = null // 清空定时器即可
        func.apply(context, args) // 希望你没忘记这儿, 忘了的话去看看防抖的this指向小节
      }, wait)
    }
  }
}

container.onmousemove = throttle(getUserAction, 1000);
```

这里是沿用了防抖的例子, 现在功能写好了, 鼠标在屏幕上移动, 事件永远保持每秒一次的调用, 成功!

::: tip 小瑕疵
事件不会在刚开始(鼠标开始移动时)就执行, 他只会在开始后的第1秒后才开始, 这就是 [节流的定义](./Throttle.md#节流的定义) 中提到的 `lead`, 我们后面会解决它
:::

## 时间戳的实现

现在来换个思路, 用时间戳来实现: 事件开始触发时记录一个时间戳 `previous`, 之后每次执行重复事件时校验新时间戳 `now` 与 `previous` 的间隔是否是处于 n 秒以外, 也就是 `now - previous > n` , 如果是则重写时间戳 `previous`, 重新循环上述过程。

说完就开整:

```js {10}
function throttle(func, wait) {
  var previous = 0
  
  return function() {
    var now = +new Date()
    var context = this;
    var args = arguments;
    if(now - previous > wait) {
      func.apply(context, args)
      previous = now // 重写previous
    }
  }
}
```

现在可以实现需求啦! 但是同样有个小问题

::: tip 小瑕疵
如果间隔给的较长能感知到, 如果在间隔时间还没结束就停止触发的话, 那么真正意义上的最后一次其实并未真的执行, 而是在前一个单位时间后执行, 例如 在第3.6s停止触发, 其实真正只执行了第3秒的那一次事件。
:::

## 魔法卡: 融合

上面两种实现方式都有点瑕疵, 用户比任何人都挑剔: 我希望我开始移动鼠标时就开始执行第一次, 当我在任意时间结束触发时就在此刻再执行一次!

那就把刚刚两种实现方式融合到一起好了!

```js
function throttle(func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  // 定义一个需要被延迟执行的函数
  var later = function() {
    previous = +new Date();
    timeout = null;
    func.apply(context, args)
  };

  var throttled = function() {
      var now = +new Date();
      // 下次触发 func 剩余的时间
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
        // 如果没有剩余的时间了或者你改了系统时间
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
  };
  return throttled;
}
```