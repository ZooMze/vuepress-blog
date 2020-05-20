---
title: Vue-Cli3 的 polyfill
date: 2020-05-20
categories:
 - 基础
tags:
 - Vue
 - Vue-Cli 3.x
 - polyfill
---
# Vue-Cli3 set polyfill

## browserslist
脚手架已在`package.json`配置了`browserslist`字段, 该字段制定了在哪些范围下应用ployfill
这个值会被 [@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env.html) 和 [Autoprefixer](https://github.com/postcss/autoprefixer)  用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀

[browserslist 的详细配置](https://github.com/browserslist/browserslist)

## polyfill
一个默认的 Vue CLI 项目会使用 [@vue/babel-preset-app](https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/babel-preset-app)，它通过 `@babel/preset-env` 和 `browserslist` 配置来决定项目需要的 polyfill

默认情况下，它会把 `useBuiltIns: 'usage'` 传递给 `@babel/preset-env`，这样它会根据源代码中出现的语言特性自动检测需要的 polyfill。这确保了最终包里 polyfill 数量的最小化, 实现了按需添加polyfill。**然而，这也意味着如果其中一个依赖需要特殊的 polyfill，默认情况下 Babel 无法将其检测出来**

`useBuiltIns` 的可选值: 
`usage`: 自动检测源码中使用的代码特性自动检测添加polyfill
`entry`: 根据`browserslist`, 进行添加polyfill
`false`: 忽略`browserslist`, 如果手动引入了polyfill, 则应用全部

## Usage
1. 安装 babel/polyfill
`npm install babel-polyfill --save`

2. 在 package.json 中配置 browserslist 
```JavaScript
// package.json
"browserslist": [
  "> 1%",
  "ie 11", // 添加ie11的兼容检测
  "last 2 versions"
]
```
3. 配置vue.config.js

详细请查阅文档[configureWebpack](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
```JavaScript
// vue.config.js
configureWebpack: config => { 
  config.entry.app = ['babel-polyfill', './src/main.js']
},
```
1. 配置 babel.config.js 为需要的检测模式
```JavaScript
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
```JavaScript
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry'
    }]
  ]
}
```

