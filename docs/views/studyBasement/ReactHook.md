---
title: React 的 Hook
date: 2020-06-12
categories:
 - 基础
 - 教程
tags:
 - React
---

解决React Class的痛点

<!-- more -->

## 简介

_Hook 是 React v16.8 提出的新特性。它可以让你在不用再写一遍class的情况下使用其内部的state和其他React特性。_

### 暴露痛点

React的核心即是组件, 但是这也是React存在的问题, 即使写一个简单的按钮的Class组件, 也需要不少的代码, 这其中包含了render和state维护等, 如果组件足够复杂, 那么代码将会变得非常厚重和难以维护;

**React推荐组件的最佳模式是函数而不是Class组件**, 函数组件足够简单, 但同样有问题, 没有state维护, 不支持生命周期。

React Hook, 其实就是加强版组件, 脱离Class组件, 也能达到Class组件一样完整的效果。

### 什么是Hook

React Hook 存在的意义是: 尽量将组件写成函数组件, 当你需要 **外部功能** 和 **副作用** 时, 就Hook(钩)过来。

React规定: __钩子一律使用 `use` 前缀进行小驼峰命名__

React默认提供的四个常用钩子:

* useState()
* useContext()
* useEffect()
* useReducer()

### 状态钩子: useState()

让我们先从一个简单的代码例子开始, 将刚刚得痛点内容, 写一个按钮的组件, 他内部包含state管理, 实现点击后文本替换的功能:

```jsx
import React, { Component } from 'react';

export default class Button extends Component {
  constructor() {
    super();
    this.state = { buttonText: '点我!' };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(() => {
      return { buttonText: '你已经点击过了哦!' };
    });
  }
  render() {
    const { buttonText } = this.state;
    return <button onClick={this.handleClick}>{ buttonText }</button>;
  }
}
```

Class组件虽然结构清晰, 但是代码量确实是 '不小', 下面我们使用Hook来重写它

```jsx {2}
export default function Button () {
  const[buttonText, setButtonText] = usaState('点我!')

  function handleClick() {
    return setButtonText('你已经点击过了哦!')
  }

  return <button onClick={handleClick}>{buttonText}</button>
}
```

首先说明一下 `useState()` 函数做了些啥:

`useState()` 接收一个参数, 表示 **'状态的初始值'**, 在上例中, 初始值是 '点我!', 它直接作为 `buttonText` 的值显示在按钮中;

然后是`useState()`的返回, 它返回一个数组:
* 数组第一项指向 **'当前状态的值'**, 在上例中, 未点击时, 它的值保持在 '点我!'
* 数组第二项是一个函数, 用于 **'更新状态'**, 上例中 `setButtonText(你已经点击过了哦!')` 将该文本给 `buttonText` 更新状态并赋值

### 共享状态钩子: useContext()

刚刚只提到了一个button组件使用hook去引入状态, 那如何在两个组件之间共享状态呢, 这就要使用 `useContext()` 钩子。

由于React本身的是自上而下的数据流, 组件间共享状态其实实现比较困难, 但还好我们有 [React Context API](https://zh-hans.reactjs.org/docs/context.html), 他相当于将多个组件组合, 并作为供应商( **Provider** ) 生产 '全局变量', 任由订阅者( **Consumer** )消费这些变量。


```jsx {1, 4}
const AppContext = React.createContext({}); // 这里是初始值

<AppContext.Provider value={{
  username: 'superawesome' // 所要共享的数据
}}>
  <div className="App">
    <Navbar/>
    <Messages/>
  </div>
</AppContext.Provider>
```

然后, 在子组件中使用Context, 就以Navbar为例:

```jsx {3}
// Navbar.js 注意： 与 AppContext 在同一个组件内
const Navbar = () => {
  const { username } = useContext(AppContext); 
  return (
    <div className="navbar">
      <p>AwesomeSite</p>
      <p>{username}</p>
    </div>
  );
}
```

如果你的子组件被抽离，来看看 [这个例子](https://zh-hans.reactjs.org/docs/context.html#updating-context-from-a-nested-component), 如果不是很明白 React Context 的 `provider` 和 `consumer`, 最好从头开始阅读学习 [React Context API](https://zh-hans.reactjs.org/docs/context.html)。

### action钩子: useReducer()

未完待续...

