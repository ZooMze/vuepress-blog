---
title: Vue@3.x 响应性API 
date: 2021-04-06
categories:
 - 基础
 - 教程
tags:
 - Vue3
 - JavaScript
 - 教程
 - 响应性API
---

## 目的

本篇短文的目的旨在搞懂这一堆响应性API到底在干什么, 为什么要使用这些API以及粗略举例实际情况中如何使用这些API

## 缘起

Vue3 使用了ES2015的新特性 [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy), 它取代了 Vue2 中的`Object.defineProperty`, 这使得数据监听会更加强大

响应性API主要分为两种, `Reactive` 和 `Ref`, 简单的理解即是他们都可以让数据变为响应式的, 这就是vue响应式的本质;

因为依赖跟踪的关系，当响应式状态改变时视图会自动更新

> 可能你会疑问为啥要介绍这两个响应性API, vue的数据不本来就是响应式的吗?

确实没毛病, 那是因为vue将你写在`data()` Option中的数据自动进行了自动`reactive`处理所以变为了响应式, 而在vue3的 [*composition API*](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api) 中, 响应式数据需要自己在`setup`中创建, 否则你在修改数据值时vue将不会更新界面, 看下面这个例子

```html
<template>
  <div>
    <p>reactiveData: {{ reactiveData.num }}</p>
    <p>defaultData: {{ defaultData }}</p>

    <p>refData: {{ refData }}</p>
    <button @click="handleClick"> change </button>
  </div>
</template>

<script>
  import { reactive, ref } from 'vue'

  export default {
    setup() {
      const reactiveData = reactive({ num: 666 });
      const refData = ref(666);
      let defaultData = 666; // 创建一个通常的值

      // 自增
      setTimeout(() => {
        reactiveData.num += 1;
        defaultData += 1;
        console.log(reactiveData.num, defaultData)
      }, 1000)

      // 定义方法
      const handleClick = () => {
        refData.value += 1;
      };

      // 混入至当前组件的渲染上下文
      return {
        reactiveData,
        defaultData,
        refData,
        handleClick,
      };
    },
  }
</script>
```

运行一下会发现:

1. 两个数据都在自增, 但`defaultData`并**不会**更新界面, 而`reactiveData`会更新界面
2. 点击change按钮, 界面会正常更新`refData`

> 如果没整明白setup建议先学习一哈 [*composition API*](https://v3.cn.vuejs.org/guide/composition-api-introduction.html), 本文只是提及响应性API

## 开始

了解了为什么要使用响应性API, 接下来就是如何使用它们, 创建的方法上一节的例子已经展示过了, 那就让我们先打印一下这两个创建的数据都长什么亚子

```js
const reactiveData = reactive({ key: 'value'})
const refData = ref('value')

console.log(reactiveData)
// >> Proxy { key: 'value' }
console.log(refData)
// >> RefImpl { _value: 12, ... }
```

可以发现, `reactive`是真的Proxy, 它与`new Proxy()`实例化表现一致; 而`ref`是一个 RefImpl 引用, 暂时不理解没关系, 下面Ref的部分会细说

这与它们二者的用途有很大的关系, **`reactive`用来创建 *对象类型* 的响应式数据, `ref`则是用来创建响应式的 *基本类型* 数据**

正如上面所说, `reactive`创建响应式的基本类型数据时, vue会报警告:

```js
const errorData = reactive(666)
// [vue warn] >> 'value cannot be made reactive: 666'
```

好, 然后我们开始更加详细的展开这俩响应式数据的相关知识

## Reactive

### `reactive`

官方API的描述为: 返回对象的响应式副本

正如上一节所说, `reactive`是创建了一个Proxy, **Proxy 是一个包含另一个对象或函数并允许你对其进行拦截的对象**。他拦截了我们对数据的操作, 并可以按照我们所想对源数据(target)进行一系列操作(handler)

`reactive`是创建响应式数据的最基本方式, 这个创建是深度的, 即内部**所有层级的对象**都是响应式的

### `readonly`

创建一个只读的响应式数据, `readonly`它接受一个通常对象或者是响应式对象, 它也是代理Proxy, 当你尝试修改`readonly`的值时, vue会报警告

```js
const readonly = readonly({ count: 0 })
const readonlyRef = readonly(ref(666))

original.count++
// [vue warn] >> 'Set operation on key "count" failed: target is readonly.'

readonlyRef.value++
// [vue warn] >> 'Set operation on key "value" failed: target is readonly.'
```

### 响应式判断

有三种方法可以判断是否是响应式数据: `isProxy`, `isReactive`, `isReadonly`

```js{8,12}
const reactiveData = reactive({ num: 666 })
const readonlyData = readonly({ num: 666 })

const obj = { num: 666 };
const customProxy = new Proxy(obj, {
  get(target, propKey, receiver) {
    console.log('get');
    return Reflect.get(target, propKey, receiver); // getter 
  },
  set(target, propKey, value, receiver) {
    console.log('set');
    Reflect.set(target, propKey, value, receiver); // setter
  }
) // 自定义Proxy

console.log(isProxy(reactiveData));    // true
console.log(isProxy(readonlyData));    // true
console.log(isProxy(customProxy));     // false

console.log(isReactive(reactiveData)); // true
console.log(isReactive(readonlyData)); // false

console.log(isReadonly(reactiveData)); // false
console.log(isReadonly(readonlyData)); // true
```

> 注意`isProxy`是指判断是否是由 `reactive` 或 `readonly` 创建的Proxy, 所以对于自定义的Proxy返回时`false`

### `toRaw`

> raw *.adj* 原始的; 未经处理的; 自然状态的;

然而我们也不是一直希望Vue对数据进行追踪, 如果你在某一刻想让其失去响应式, 使用`toRaw`即可, 这个方法作用就是去掉响应式Proxy, 返回数据源本身

```js
const num = {}
const reactiveNum = reactive(num)

console.log(toRaw(reactiveNum) === num) // true
```

### `shallowReactive`

了解了上面的API, 我们了解了`reactive`是深度的, 但是有时数据嵌套很多很深时, 我们并不希望它深层响应, 使用`shallowReactive`即可避免这种情况, 从而减少性能开销

```js
const shallowReactiveData = shallowReactive({
  num: 666,
  children: {
    num: 777
  }
})

console.log(isReactive(shallowReactiveData.children)) // false
```

## Ref

> ref 即 reference n.  参考; 涉及; 引用(计算机领域)

在JavaScript的世界中, 基本数据类型是通过**值本身**而非**引用**来传递的, 这就导致基本数据类型天生就不是响应性的, 但如果我们将其封装到一个对象中, 再套用一下`reactive`那一套逻辑, 岂不他就变成了响应式的? 对没错, 这就是`ref`来完成的事情

`ref` 即是为基本类型的值创建了一个**响应式引用**, `ref`只包含一个名为`value`的属性, 意味着你尝试在setup中修改其值时, 不要忘记添加 `.value`:

> 为什么要强调在setup中, 在 [*自动展开*](./ReactivityAPI.md#自动展开) 这一节会进行阐述

```js
cosnt refData = ref(666)

console.log(refData.value) // >> 666
```

### `toRef`

响应式数据看起来很美好, 但是数据的响应性在某些情况下会丢失:

```js
const reactiveData = reactive({ num: 666 })
const objectData = { num: reactiveData.num }

objectData.num = 2 // reactiveData.num 视图和数值都不会应用更改, 响应丢失了
```

> `toRef` 可以在**响应式数据上**创建一个新的`ref`, 并一直保持响应式连接

`toRef` 是单独目标的, 即它一次只能在一个属性(即key)上产生效果

```js
const reactiveData = reactive({ num: 666 })
const objectData = { num: toRef(reactiveData, 'num') } // 用toRef处理单个属性值

objectData.num.value = 2 // 结果如预期, reactiveData更新了
```

好, 问题解决了, 新的麻烦又来了, 数据变成了一个ref, 这意味着你在某些时候要使用 `.value` 来自己手动展开, 后面将提到 *自动展开*

### `toRefs`

你可能很喜欢使用解构赋值, 这样在获取想要的属性会非常方便且优雅, 但是遗憾的是, **解构后的属性也会丢失响应**, 经过上一节的知识你可能会想到, 那我就蛮力对一个对象中所有属性都进行`toRef`, 这样是可以达到目的但是不够优雅, 所以`toRefs`出现了, 它可以解决这个问题

在setup中就常常用到解构:

```js{10}
setup() {
  const objectData = reactive({
    param1: 111,
    param2: 222,
    param3: 333,
    param4: 444
  })

  return {
    ...objectData // 注意这里是解构
  }
}
```

毫无疑问, 最终渲染环境中 `objectData` 的所有属性(`param1` ~ `param4`)的响应性都已经丢失了, 让我们用 `toRefs`来处理一波

```js
setup() {
  const objectData = reactive({
    param1: 111,
    param2: 222,
    param3: 333,
    param4: 444
  })

  return {
    ...toRefs(objectData)
  }
}
```

这样在模板和methods Option中都可以直接使用这四个响应式的数据了

```js{6}
methods: {
  setup() {
    // ... 同上
  },
  changeParam() {
    this.param1 = -1 // param都已经解构并加入至渲染上下文中
  }
},
```

### 自动展开

vue还帮你做了一件事情, 还记得setup最终会混入渲染上下文吗? vue不仅做了混入还帮你做了 *自动展开* :

```js
setup() {
  const refData = ref(666)
  const reactiveData = reactive({
    num: 666
  })

  console.log(refData, reactiveData)

  return {
    refData,
    reactiveData
  }
},
mounted() {
  console.log(this.refData, this.reactiveData)
}
```

打开控制台发现了什么不同吗?

::: tip 输出差异
**`reactiveData`** mounted和setup中打印结果一致;

setup中 **`refData`** 打印了 RefImpl, 它是一个ref引用,
mounted中 **`refData`** 打印了 666, 它是一个值
:::

这就是vue为了让开发者减少心智负担的 *自动展开*

> vue会为你在以下**两种情况**时自动展开(不用添加 **`.value`** 来访问数据)
>
> 1. 在渲染上下文中时
> 2. 作为响应式对象的属性时

```html{21}
<template>
  <div>
    <!-- 自动展开 -->
    <span>{{ refData }}<span>
  </div>
</template>

<script>
  import { ref, reactive } from 'vue';

  export default {
    setup() {
      const refData = ref(666)
      const reactiveData = reactive({
        refData
      })

      console.log(reactiveData.refData) // >> 666

      // 试试通过reactive修改ref的值
      reactiveData.refData = 0 // 这里自动展开了
      console.log(refData.value) // >> 0 (refData的值也被修改了, 老铁没毛病)

      return { refData, reactiveData }
    }
  }
</script>
```

## 响应式侦听

官方文档的顺序是先介绍计算后介绍侦听, 但是本文是反着来的, 至于为何看过你会明白

侦听与vue@2.x中意思一样, 就是检测数据的变化, 但是有略微不同

### `watchEffect`

先来看文档描述:

在响应式地跟踪其依赖项时立即运行一个函数，并在**更改依赖项时重新运行它**。

那意思是这个`watchEffect`只要触发了数据修改(函数副作用)就会触发执行咯? 那么我们来上手试试

```js{11-13}
setup() {
  const sum = ref(0);
  const num1 = ref(111);
  const numIncrease = ref(222);

  const timer = setInterval(() => {
    numIncrease.value += 100; // 自增
    sum.value = num1.value + numIncrease.value; // 求和
  }, 1000);

  watchEffect(() => {
    console.log(sum);
  });

  return {
    sum
  }
}
```

遗憾的是, 这个侦听函数不会周期地执行, 它只在vue组件被创建时执行一次, 那么这是为何呢?

回忆一下vue我们写的`watch` Option, 是不是发现了watchEffect是**无目标的**, 它没有任何入参, 所以要想让这个函数周期执行, 那我们就得让他指哪儿打哪儿, 稍作修改:

```js
watchEffect(() => {
  console.log(sum.value); // 明确了sum的value
});
```

不要忘了, `sum`是一个`ref`, 每次变化的是`sum`的值(value), 要做到指哪儿打哪儿, 就得关注他的值

好, 然后试试`reactive`:

```js
setup() {
  const numData = reactive({
    num1: 111,
    numIncrease: 222,
    sum: 0
  })

  const timer = setInterval(() => {
    numData.numIncrease += 100; // 自增
    numData.sum = numData.num1 + numData.numIncrease; // 求和
  }, 1000);

  watchEffect(() => {
    console.log(numData);
  });

  return {
    numData
  }
}
```

运行结果一样的, 只会初始执行一次, 还是同样的原因, 对于`numData`这个Proxy, 变化的其实是它自身的属性, 所以我们稍作修改

```js{2}
watchEffect(() => {
  console.log(numData.num1); // 仍然执行了
  console.log(numData.sum);
});
```

::: warning 注意
可以发现`num1`其实是没有任何值变化的, 但是`console.log(numData.num1);`仍会执行, 这是因为`sum`触发了`watchEffect`, 一旦`watchEffect`被触发, 整个函数都将执行!
:::

如果你要执行多个监听, `watchEffect`是可以写多个的:

```js
setup() {
  const numData = reactive({
    num1: 111,
    numIncrease: 222,
    sum: 0
  })

  const timer = setInterval(() => {
    numData.numIncrease += 100; // 自增
    numData.sum = numData.num1 + numData.numIncrease; // 求和
  }, 1000);

  watchEffect(() => {
    console.log(numData.numIncrease);
  });

  watchEffect(() => {
    console.log(numData.sum);
  });

  return {
    numData
  }
}
```

### `watch`

你应该留意到`watchEffect`是带有危险性的, 因为你也可能无法保证在`watchEffect`内的哪些值一定会发生变化, 哪些一定不会发生变化, 这种不确定性就会导致不少问题产生

`watch`完全等同于vue2中的`watch` Option, 所以它同样的需要一个明确的侦听目标(即数据源), 它可以是一个**具有返回值的 getter 函数**，也可以是 **`ref`**

::: warning 注意
`watch`侦听的是 **响应式数据**, 非响应式数据是不会触发的
:::

```js{3,10}
// 侦听 getter
const reactiveData = reactive({ num: 0 })
watch(
  () => reactiveData.num,
  (num, prevNum) => {
    /* ... */
  }
)

// 直接侦听 ref
const refData = ref(0)
watch(refData, (num, prevNum) => {
  /* ... */
})

// 无效的代码, watch将不会触发
const constData = 0
watch(
  () => constData,
  (num, prevNum) => {
    /* ... */
  }
)
```

如果你侦听的是`reactiveData`本身, 那么这个`watch`同样不会触发, 要想触发它也很简单, 就像vue2一样添加 `deep: true`

```js{6}
watch(
  () => reactiveData,
  (num, prevNum) => {
    /* ... */
  },
  { deep: true }
)
```

### `watch` 和 `watchEffect`

这两个的共同点都是在监听响应式数据的变化然后执行回调, 了解他们的不同之处会让你更清楚在什么情况下使用他们中的谁:

|差异项|`watchEffect`|`watch`|
|:-|:-:|:-:|
|获取数据变化前后的值|√|×|
|需要指定监听对象|×|√|
|总是会初始执行一次|√|×|

## 响应式计算

好了watch大致介绍完了, 回头来看为什么`computed`要放到最后来说, `computed`其实本质还是一个`watchEffect`, 只是它多了一个返回值

### `computed`

```js{4-7}
setup() {
  const num = ref(666)

  const plus = computed(() => {
    console.log(num) // 初始就会执行一次, 同理watchEffect, 然后本函数将一直重复执行
    return num.value + 1;
  })

  const timer = setInterval(() => {
    num.value += 100
  })
}
```

`computed`默认将会执行一次, 跟`watchEffect`一致

> 当你在`computed`回调中出现了不相关的响应式数据时, `computed`也会执行:

```js{8-12}
setup() {
  const increaseNum = ref(0) // 无关的自增数据
  const timer = setInterval(() => {
    increaseNum.value += 100
  })

  const num2 = ref(999) // num2不会自增
  const plus2 = computed(() => {
    console.log(reactiveData.num) // 即使跟踪到了一个无关的变化的值, 这个函数仍将反复执行
    console.log(num2) // 这句也会执行
    return num2.value + 1;
  })
}
```

但其实不用担心`computed`追踪到了无关响应式数据而导致函数反复执行进而导致数据出现错误, 因为在`computed`中你是 **无法修改其他数据** 的, vue将会报错

::: warning 注意
不要去`watch`一个`computed`, `watch`不会执行
:::

## 最后

其实本文还有一些API没有介绍到, 希望看完本文的你再去了解更多的时候会更有条理一点

本文未展开说明的reactivity API和内容:

Reactive:

1. `markRaw`
2. `shallowReadonly`

Ref:

1. `isRef`
2. `customRef`
3. `shallowRef`
4. `triggerRef`

计算与侦听:

1. 多个源的Watch侦听
2. 停止侦听

想更加深入理解就去多看看官方文档吧~

[vue 响应性API](https://v3.cn.vuejs.org/api/reactivity-api.html)