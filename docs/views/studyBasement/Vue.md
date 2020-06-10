---
title: Vue
date: 2020-05-20
categories:
 - 基础
tags:
 - Vue
desc: 本md文档使用了vuepress扩展, 移植时需要注意格式
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

## Vuepress

### 安装并使用

### 引用第三方库

### 使用Vue组件
在vuepress中, 可以直接在md文件中插入vue组件, 就像使用.vue文件一样


## Vue-Router

## Vuex

## Vue-Cli 3.x