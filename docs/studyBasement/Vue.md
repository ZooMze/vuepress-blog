# Vue

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
以上写法是语法糖

```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) { 
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```


## Vuepress

### 使用Vue组件
在vuepress中, 可以直接在md文件中插入vue组件, 就像使用.vue文件一样


## Vue-Router

## Vuex

## Vue-Cli 3.x