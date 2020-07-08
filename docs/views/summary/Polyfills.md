---
title: 脚手架的 polyfills
date: 2019-04-20
categories:
 - 备忘
tags:
 - Umi 3.x
 - Vue-Cli 3.x
 - polyfills
---

本篇分别简单的介绍了在 vue 和 react 脚手架项目中浏览器兼容browserlist, 受益于脚手架的内部封装, 我们可以很简单的完成配置。

## Vue Cli 3.x

### browserslist

脚手架已在`package.json`配置了`browserslist`字段, 该字段制定了在哪些范围下应用ployfill
这个值会被 [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer)  用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀

[browserslist 的详细配置](https://github.com/browserslist/browserslist)

### polyfill

一个默认的 Vue CLI 项目会使用 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)，它通过 `@babel/preset-env` 和 `browserslist` 配置来决定项目需要的 polyfill

默认情况下，它会把 `useBuiltIns: 'usage'` 传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill。这确保了最终包里 polyfill 数量的最小化, 实现了按需添加polyfill。**然而，这也意味着如果其中一个依赖需要特殊的 polyfill，默认情况下 Babel 无法将其检测出来**

`useBuiltIns` 的可选值: 
值|描述
:-|:-
`usage`|自动检测源码中使用的代码特性自动检测添加polyfill
`entry`|根据`browserslist`, 进行添加polyfill
`false`| 忽略`browserslist`, 如果手动引入了polyfill, 则应用全部

### 如何使用

1、安装 babel/polyfill
`npm install babel-polyfill --save`

2、在 package.json 中配置 browserslist

添加如下代码即可:

```js
// package.json
"browserslist": [
  "> 1%",
  "ie 11", // 添加ie11的兼容检测
  "last 2 versions"
]
```

阿萨德

3、配置vue.config.js

详细请查阅文档[configureWebpack](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)

```js
// vue.config.js
configureWebpack: config => { 
  config.entry.app = ['babel-polyfill', './src/main.js']
},
```

4、配置 babel.config.js 为需要的检测模式

```js
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ]
}
```

或者如上文所说直接配置入口

```js
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ]
}
```

## Umi 3.x

在Umi中配置更加简单, 类似vue的polyfills的配置, 直接在 `targets` 配置即可, `targets` 是一个对象, 它接收一些浏览器以及其最低版本:

```js
{
  chrome: 49,
  firefox: 64,
  safari: 10,
  edge: 13,
  ios: 10
}
```

如果需要兼容 ie10+, 直接配置:

```js
export default {
  targets: {
    ie: 10,
  }
}
```

::: tip 注意

* 无需再配置已有的默认值, 如果再次配置将会重写
* 在值为false时, 表示删除本浏览器的默认配置
  
:::

## 注意事项

如果没有兼容需求时, 不要添加任何无关的兼容配置, 添加配置将会添加一些只生效于兼容的代码, 为了代码量的优雅度, 这些冗余代码需要避免。
