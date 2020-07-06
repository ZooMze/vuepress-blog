---
title: Vue
date: 2020-05-20
categories:
 - 基础
tags:
 - Vue
---

## 基础

### 在computed()中传递参数
在这里利用了闭包, 调用了父函数作用域的内容
```js
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```JavaScript
...
  computed: {
    // 计算属性的 getter
    reversedMessage() {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
...
```

## Vue-Router

## Vuex

## Vue-Cli 3.x