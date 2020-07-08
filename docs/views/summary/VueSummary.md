---
title: Vue 要点总结
date: 2019-12-21
categories:
 - 基础
 - 备忘
tags:
 - JavaScript
 - Vue
---

聚沙成塔, 水滴石穿
<!-- more -->

## var / let / const 的区别

* var 会变量提升 let 和 const 不会
* var 在全局命名的变量会挂载到 window 上，let const 不会
* let 和 const 有块级作用域（暂时性死去），var 没有
* let const 不允许重复命名

## computed / filters 的异同

* 对于单个入值的计算, 使用 computed
* 对于多个入值的计算, 使用 filter (得益于filter携带参数写法更加方便)
* 两者在入值 **变化** 时都会触发更新
* 两者都不应承载较多的计算或者逻辑内容, 如果有需求, 使用 `watch`

::: tip 注意

* 上面提到的三种 '计算' 方式, 要避免重复写逻辑, 即不要多处计算方法内写相同的计算逻辑
* 使用 `watch` 时要避免同时修改被监听的数据导致再次触发 `watch`
:::

### 立即执行的 watch

我们知道, `watch` 内的回调只在值变化时触发, 在初始化时是不会触发的, 例如 `watch` 分页的值 `page`, 初始 `page == 1`, 但是我们仍期望执行一次查询, 通常会把这个第一次查询写在 `created` 或是 `mounted` 里。

直接使用 `immediate` 属性即可快速实现这一需求 同时减少不必要的代码和理解成本:

```js {6}
watch: {
  'page': {
    handler(newV) {
      this.fetchData()
    },
    immediate: true
  }
}
```

::: tip 更多
`watch` 的对象中还有一个属性: `deep`, 他可以深度监听内部更深的属性
:::

## 动态组件 components

在v-for循环中条件输出不同的组件, 可以通过 `is` 属性快速直观的实现;
这种方式更适合参数相同或者无参的组件。

```js
import Component1 from '@/components/Component1.vue'
import Component2 from '@/components/Component2.vue'
import Component3 from '@/components/Component3.vue'

export default {
  ...
  components: {
      Component1,
      Component2,
      Component3,
  },
  data() {
    return {
      componentList: [
        'Component1',
        'Component2',
        'Component3',
      ]
    }
  }
}
```

使用组件:

```js
// in template
<component v-for="(item, index) in componentList" :key="index" :is="item"></component>
```

编译结果:

```jsx
<Component1></Component1>
<Component2></Component2>
<Component3></Component3>
```

## 尽量不使用 v-for + v-if

`v-for` 的优先级比 `v-if` 高, 两者嵌套使用时, `v-for` 已经将全部数据遍历过了, 即使运行结果看起来被 `v-if` 过滤掉像是没有执行一样。

在数据量小的时候这样写是可以接受的, 如果数据过多, 应该在js处理完成数据之后在进行 `v-for`, 因为 `render` 遍历消耗的资源可比在js中遍历消耗得多。

## $on() 在任意位置的监听

通常Vue内部是自给自足脱离window这一对象的, 但是也会有特殊情况, 例如: 检测浏览器的宽高, 从而调整内部组件的位置大小等。

常规思路是直接在Vue的生命周期内部关联事件监听器, 再使用 `methods` 里面的方法回调事件, 像这样:

```js
mounted () {
  window.addEventListener('resize', this.resizeHandler);
},
beforeDestroy () {
  window.removeEventListener('resize', this.resizeHandler);
}
```

但是每次都这样写, 为了避免事件重叠还必须要在当前组件销毁前将事件也 **注销** 掉, 这样代码分离过远导致修改时漏掉, 易读性大大降低, 于是我们用API `$on()` 来改写一下上面的代码:

```js {4-6}
mounted () {
  window.addEventListener('resize', this.resizeHandler);
  // 注册和注销的代码 写在一起, 使得代码可读性大大提高
  this.$on("hook:beforeDestroy", () => {
    window.removeEventListener('resize', this.resizeHandler);
  })
}
```

## v-pre 和 v-once

这两个指令都能有助于提高渲染效率:

* `v-pre` 会跳过**编译过程**, 直接输出当前内容

```js
<el-button v-pre>{{ page }}</el-button> // >> 直接输出 '{{ page }}' 而不是页码
```

* `v-once` 只渲染一次, 适用于渲染不再修改的静态内容, 合理使用可以节省很多性能损耗

::: warning 警告
使用 `v-pre` 时, 注意不要添加事件绑定等特殊属性, 否则会导致编译错误; 同时 `v-pre` 应该尽量用于原生DOM标签上。
:::

## $set 触发数组更新

先来看看在下面的代码中, 假设一下每行代码分, 那些操作会触发视图更新?

```js
  <template>
    <div>
      <div v-for="item in listData" :key="item.id">{{ item.name }}</div>
      <el-button @click="handleClick1">修改1</el-button>
      <el-button @click="handleClick2">修改2</el-button>
      <el-button @click="handleClick3">修改3</el-button>
    </div>
  </template>
  ...
  data() {
    listData: [{ name: 'a', id: '1' }, { name: 'b', id: '2' }, { name: 'c', id: '3' }]
  }
  ...

  // 以下方法每次分开执行, 每一个执行完后刷新, 没有先后关系
  handleClick1() {
    this.listData[2].name = 'd'
  },
  handleClick2() {
    this.listData[2] = { name: 'd', id: '4' }
  },
  handleClick3() {
    this.listData.length = 2
  }
  ...
```

::: details 查看结果

```js
handleClick1()
// 视图和listData同步更新为 >> [{ name: 'a', id: '1' }, { name: 'b', id: '2' }, { name: 'd', id: '3' }]

handleClick2()
// 视图不刷新 listData已变为: [{ name: 'a', id: '1' }, { name: 'b', id: '2' }, { name: 'd', id: '4' }]

handleClick3()
// 视图不刷新 listData已变为: [{ name: 'a', id: '1' }, { name: 'b', id: '2' }]
```

:::

结论: 由于`Object.defineprototype()`的限制, 当 _通过索引修改多维数组项_ 或者 _直接修改数组长度时_, 数据不会更新视图, 要想更新视图,  使用API `$set`:

```js
this.$set(listData, 2, { name: 'd', id: '4' });
```

* 更详细的内容查看官方文档: [全局API:  $set](https://cn.vuejs.org/v2/api/#Vue-set)