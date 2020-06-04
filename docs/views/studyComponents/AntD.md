---
title: Ant Design 
date: 2020-05-29
categories:
 - 扩展
tags:
 - React
 - Ant Design
---

# Ant Design

本文章推荐先阅读 [React 基础](./React) 后在进行阅读

从零搭建一个React是实际应用, 这里使用了[Ant Design](https://ant-design.gitee.io/docs/react/use-with-create-react-app-cn), 文档中已经有较详细的指引内容, 故本文重在细节延伸说明等内容。

## 在 create-react-app 中使用

### 安装create-react-app

安装create-react-app的部分参考[这里](./React#create-react-app)

### 安装ant-design

按照上面的步骤生成好后
```
yarn add antd
```

在 `src/App.js` 中引入 antd

```jsx
import React from 'react';
import { Button } from 'antd';
import './App.css';

const App = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default App;
```
修改 `src/App.css` ，在文件顶部引入 `antd/dist/antd.css` 。

```js
@import '~antd/dist/antd.css';
```
至此antd已经完全应用到本项目中了, 继续向下阅读。
或者可以直接使用ant官方提供[template模板]()代码直接使用

## 自定义主题的解决方案

### craco

这里我们使用 craco (一个对 create-react-app 进行自定义配置的社区解决方案) 进行主题修改。

首先安装 `@craco/craco`

```
yarn add @craco/craco
```

修改 `package.json` 里的 `scripts` 属性。

```js {3-8} 
/* package.json */
"scripts": {
-   "start": "react-scripts start",
-   "build": "react-scripts build",
-   "test": "react-scripts test",
+   "start": "craco start",
+   "build": "craco build",
+   "test": "craco test",
}
```

然后在项目根目录创建一个 `craco.config.js` 用于修改默认配置, 稍后将为其添加配置, 先就让它待着。

```js
/* craco.config.js */
module.exports = {
  // ...
};
```

### 自定义的配置

自定义主题需要用到类似 `less-loader` 提供的 `less` 变量覆盖功能。我们可以引入 `craco-less` 来帮助加载 `less` 样式和修改变量。

修改原本的 `src/App.css` 文件为 `src/App.less`; 同时修改引入的相关位置, 在修改后 `App.less` 文件中, 修改引入antd的样式文件

```js
/* src/App.js */
- import './App.css';
+ import './App.less';
```

```less
/* src/App.less */
- @import '~antd/dist/antd.css';
+ @import '~antd/dist/antd.less';
```
安装 `craco-less` 

```
yarn add craco-less
```

修改刚刚创建的 `craco.config.js` 文件:

```js {9}
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: {// 自定义主题色
            '@primary-color': '#1DA57A'
          },
          javascriptEnabled: true,
        },
      },
    },
  ],
};
```
`modifyVars` 中即是自定义变量的内容。

### 变量参考

antd使用了 `less`, 提供了全局的样式变量可供覆盖修改:

```less
@primary-color: #1890ff; // 全局主色
@link-color: #1890ff; // 链接色
@success-color: #52c41a; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 4px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15); // 浮层阴影
```

更多变量可以在本地文件 `/components/style/themes/default.less` 中查看,或者查看 [这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)



## 路由解决方案

React Router 保持 `UI` 与 `URL` 同步。它拥有简单的 API 与强大的功能例如代码缓冲加载、动态路由匹配、以及建立正确的位置过渡处理。你第一个念头想到的应该是 URL，而不是事后再想起。

源码在这里: [react-router](https://github.com/ReactTraining/react-router)

### 安装

```
npm install --save react-router
```

