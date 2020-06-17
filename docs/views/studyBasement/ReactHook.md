---
title: 掌握React 的 Hook
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

_Hook 是 React 16.8 提出的新特性。它可以让你在不用再写一遍class的情况下使用其内部的state和其他React特性。_

### State Hook

让我们先从一个简单的代码例子开始, 下例是一个计数器, 每次点击按钮, `count`就 +1:

```jsx {4-5}
import React, {useSate} from 'react'

function Counter() {
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>你点击了 {count} 次。</p>
      <button onClick={() => setCount(count + 1)}/>
    </div>
  )
}
```

现在我们来看看这个 Hook 做了什么:  