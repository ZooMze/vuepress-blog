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

## vuex

vuex 是 vue.js 中的状态管理, 它的出现是为了解决在多个组件之间复用和修改**同一属性**困难的问题

### 辅助函数

本小节通过介绍辅助函数来巩固加深 vuex中的相关知识和内容

vuex中提供了若干辅助函数, 通过扩展组件内原有的内容(即 对象混合), 例如 `computed` / `methods`, 使用我们可以更方便的调用vuex中的所有内容

我们先在store中简单定义一些基本内容, 方便后面的代码演示:

```js
...
  state: {
    name: 'a',
    name2: 'aa'
  },
  getters: {
    getName: state => {
      return state.name
    },
    getNewName: (state) => (idNumber) => { // 这里可以让getter带参调用
      return `${state.name} ${idNumber}`
    }
  },
  mutations: { // 这里命名的方式是参考了vuex的官网, 也可以不这样命名
    CHANGE_NAME: state => {
      state.name = 'b'
    },
    CHANGE_LAST_NAME: (state, params) => {
      state.name = state.name + params
    }
  },
  actions: {
    changeName(state) {
      state.commit('CHANGE_NAME')
    },
    ChangeLastName({ commit }, payload) {
      commit('CHANGE_LAST_NAME')
    },
  }
...
```

#### mapState

快速获取状态state, 不用再重复的写 `this.$store.state.name`, 并且可以将state的变量再取一个新的变量名

```js
...
data() {
  return {
    localName: '666'
  }
},
computed: {
  ...mapState(['name','name2']) // 这里不能随便改名字
  // 像下方这样写也是OK的
  // ...mapState({
  //   newName: 'name',
  //   newName2: (state) => state.name2,
  //   mixName(state) { // 为了能够使用 this 获取局部状态，必须使用常规函数
  //     return `${state.name} ${this.localName}`
  //   }
  // })
}
...
// 在组件内随时调用
this.name    // >> 'a'
this.newName // >> 'a'
this.mixName // >> 'a 666'
```

#### mapGetters

快速获取getter, getter用于对state的状态进行派生和逻辑处理等, 它存在的意思有点类似于组件里的计算属性一样

```js
import { mapGetters } from 'vuex'
...
computed:{
  ...mapGetters(['name','name2']) // 这里不能随便改名字
  // 像下方这样重新取名也是可以的
  // ...mapGetters({
  //   getName: 'getName',
  //   getNewName: 'getAllName'
  // })
}
...
// 在组件内随时调用
this.getName         // >> 'a'
this.getNewName(777) // >> 'a 777'
```

#### mapMutation

mutation的用处是来改变state内的值, 并且在vuex中只能通过这一种方式进行显示提交, mapMutation 是用来提供映射来简化代码

\* mapMutation 是扩展了methods对象

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      // `mapMutations` 支持载荷(payload)：
      'CHANGE_LAST_NAME' // 将 `this.CHANGE_LAST_NAME(amount)` 映射为 `this.$store.commit('CHANGE_LAST_NAME', amount)`
    ]),
    // 也可以改名字
    ...mapMutations({
      changeLastName: 'CHANGE_LAST_NAME'
    })
  }
}

// 在组件中调用
this['CHANGE_LAST_NAME']('mutation') // >> 'a 后缀词'
this.changeLastName()                // >> 'a'
```

#### mapActions

当一个组件内多次重复调用 `this.$store.dispatch()`来提交action时, 同样可以使用类似上面的 `mapActions` 来达到映射简化的目的

```js
import { mapGetters } from 'vuex'
...
computed:{
  ...mapActions({
    // 同样支持载荷
    change: 'changeLastName'
  })
}
...
// 在组件内调用
this.change('action') // 相当于调用了 this.$store.dispatch('changeLastName', 'c') >> 'a action'
```

### Modules

当状态过多时, 全部揉在一个store里就会变得臃肿和难以维护, 这时就要进行拆分成module, 每一个module都可以拥有自己的state, getters, mutations, actions

::: warning 注意
这些modules 里的所有状态内容, 会被合并到全局状态里面去, 所以可以通过添加 `namespaced: true` 将其变为带命名空间的模块, 已达到更高的封装性

```js
// in user.js
export default {
  namespaced: true, // 开启后, 所有内容会加上module的名字作为前缀
  state,
  getters: {
    getUser: (state) => {
      return state.userName + '666'
    }
  }
  mutations,
  actions
}
```

这样一来, 当你在外部需要访问 user module 中的getUser()时, 其名称会变为 'user/getUser', 例如

```js
// in component
computed: {
  ...mapGetters({ getUser: 'user/getUser' }) // 这里重新命名了
},
```

:::
