---
title: Ant Design Pro 
date: 2020-06-10
categories:
 - 扩展
 - 教程
 - 框架
tags:
 - React
 - Ant Design
 - Ant Design Pro
 - Umi 3.x
---

基于umi 和 dva 的脚手架
<!-- more -->

## 简介

Ant Design Pro 是一个企业级中后台前端/设计解决方案，秉承 Ant Design 的设计价值观，致力于在设计规范和基础组件的基础上，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。

基于上述目标和提供了以下的典型模板，并据此构建了一套基于 React 的中后台管理控制台的脚手架，它可以帮助你快速搭建企业级中后台产品原型。

- Dashboard
  - 分析页
  - 监控页
  - 工作台
- 表单页
  - 基础表单页
  - 分步表单页
  - 高级表单页
- 列表页
  - 查询表格
  - 标准列表
  - 卡片列表
  - 搜索列表（项目/应用/文章）
- 详情页
  - 基础详情页
  - 高级详情页
- 结果
  - 成功页
  - 失败页
- 异常
  - 403 无权限
  - 404 找不到
  - 500 服务器出错
- 个人页
  - 个人中心
  - 个人设置
- 图形编辑器
  - 流程图编辑器
  - 脑图编辑器
  - 拓扑编辑器
- 帐户
  - 登录
  - 注册
  - 注册成功

## 快速开始

本地环境需要安装 `yarn` 、`node` 和 `git`。

技术栈:  `ES2015+` 、`React` 、`UmiJS` 、`dvaJS` 、`g2` 和 `antd`。

### 安装

```text
yarn create umi
// or
npm create umi
```

在可选列表中选择 `ant-design-pro`, 并选择以js构建。

构建完成后安装依赖

```text
yarn
// or
npm install
```

### 目录结构

```text
├── config                   # umi 配置，包含路由，构建等配置
├── mock                     # 本地模拟数据
├── public
│   └── favicon.png          # Favicon
├── src
│   ├── assets               # 本地静态资源
│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # 全局 dva model
│   ├── pages                # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── global.less          # 全局样式
│   └── global.ts            # 全局 JS
├── tests                    # 测试工具
├── README.md
└── package.json
```

然后运行:

```text
npm start
```

## 基础开发

官方提供了可视化的图形操作功能, 本文只介绍传统的开发模式, 即从路由开始配置直到全部页面开发完成。

### 布局 , 路由 & 菜单

通常布局是和路由系统紧密结合的, 路由统一在 `config/config.js` 中管理配置:

```js {4}
routes: [
  {
    path: '/',
    component: '../layouts/BasicLayout', // 指定以下页面的布局 Layout
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis'
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor'
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace'
          },
        ],
      },
    ],
  },
];
```

除了以上基本内容外, 还有Pro所支持的额外扩展

```js
{
  name: 'dashboard', // 当前路由在菜单和面包屑的名称
  icon: 'dashboard', // 图标
  hideInMenu: true, // 当前路由在菜单中隐藏, default = false
  hideChildrenInMenu: true, // 隐藏子路由, default = false
  hideInBreadcrumb: true, // 当前路由在面包屑中隐藏, default = false
  authority: ['admin'], // 权限信息, 没有设置则当前路由不受权限控制
}
```

#### 从服务器请求菜单

在 `src/layouts/BasicLayout.jsx` 中修改 `menuDataRender`，并在代码中发起 `http` 请求，只需服务器返回下面格式的 `json` 即可。

```jsx
const [menuData, setMenuData] = useState([]);

useEffect(() => {
  // 这里是一个演示用法
  // 真实项目中建议使用 dva dispatch 或者 umi-request
  fetch('/api/example.json')
    .then(response => response.json())
    .then(data => {
      setMenuData(data || []);
    });
}, []);

...

return (
  <ProLayout
    // ...
    menuDataRender={() => menuData}
    // ...
  />
);
```

`menuData` 数据格式如下:

```js
[
  {
    "path": "/dashboard",
    "name": "dashboard",
    "icon": "dashboard",
    "routes": [ // 如果使用的是ts, routes需要换成children
      {
        "path": "/dashboard/analysis",
        "name": "analysis"
      },
      {
        "path": "/dashboard/monitor",
        "name": "monitor"
      },
      {
        "path": "/dashboard/workplace",
        "name": "workplace"
      }
    ]
  }
  // ....
]
```

### 外部链接

可以直接将完整的url写入 `path`中, 框架会自动处理为外链:

```js
{
  path: 'https://pro.ant.design/docs/getting-started-cn',
  target: '_blank', // 点击新窗口打开
  name: "文档",
}
```

如果需要自定义 menuItem 的点击逻辑, 可以通过修改 `menuItemRender` 来实现

### 新增页面

**页面** 是指配置了路由, 可以通过url直接访问到的模块, 要新建一个页面, 通常只需要在脚手架的基础上进行简单配置。

我们先创建源文件, 在 `src / pages` 下创建新的 js，less 文件。 如果有多个相关页面，您可以创建一个新文件夹来放置相关文件。

现在我们在`src / pages` 创建一个文件夹 `newFolder`, 并向其内添加我们的新页面。

```js {5-6}
config
src
  models
  pages
+   newFolder
+     NewPage.js
+     NewPage.less
  ...
...
package.json
```

先给 `NewPage.js` 中安排上最low的 `render`

```jsx
import React from 'react';

export default () => {
  return <div>New Page</div>;
};
```

样式文件默认使用 [CSS module](http://www.ruanyifeng.com/blog/2016/06/css_modules.html), 如果需要, 导入样式遍历即可

```
@import '~antd/lib/style/themes/default.less';
```

使用内置样式变量可以保持保持页面的一致性，并有助于实现自定义主题。

### 新增布局

在当前布局不足以满足需求、定制化或模块化时, 可以在原有的基础上添加模板,:

```js {17-21}
routes: [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [...],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [...],
      },
      {
        path: '/new',
        component: '../layouts/new_page',
        routes:[...]
      },
    ],
  },
],
```

### 新增路由

框架提供了两种基础的布局模板: **基础布局 (BasicLayout)** 以及 **账户相关布局 (UserLayout)**

如果需要在对应的模板下添加路由, 只需要在在其子路由中注册即可:

```js {6}
// app
{
  path: '/',
  component: '../layouts/BasicLayout',
  routes: [
    // dashboard
    { path: '/', redirect: '/dashboard/analysis' },
    { path :'/dashboard/test',component:"./Dashboard/Test"},
  ...
}
```

### 带参数的路由

默认支持带参数的路由，但是在菜单中显示带参数的路由并不是个好主意，我们并不会自动的帮你注入一个参数，你可能需要在代码中自行处理。

```js {2}
{
  path: '/dashboard/:page',
  hideInMenu:true,
  name: 'analysis',
  component: './Dashboard/Analysis',
}
```

配置好后按照如下方式进行跳转

```js
import router from 'umi/router';

router.push('/dashboard/anyParams');
```

或者:

```js
import Link from 'umi/link';

<Link to="/dashboard/anyParams">go</Link>;
```

在路由组件中，可以通过 `this.props.match.params` 来获得路由参数。

更多内容: [umi#路由](https://umijs.org/guide/router.html#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E8%B7%AF%E7%94%B1)

### 自定义图标

受限于umi脚手架, 在 `config.js` 中是不能直接使用React组件的, Pro 中暂时支持使用 ant.design 本身的 icon type，和传入一个 img 的 url。只需要直接在 icon 属性上配置即可，如果是个 url，Pro 会自动处理为一个 img 标签。

::: tip 提示
如果你想使用 iconfont 的图标，你可以使用 [ant.design](https://ant.design/components/icon-cn/#%E8%87%AA%E5%AE%9A%E4%B9%25) 的自定义图标.
:::

### 开始你的表演

尽情在新增的页面中写业务代码8~

如果需要 [dva](https://dvajs.com/) 的数据流, 还需要在 `src/models` `src/service` 中添加响应的model和 service, 写法可以仿造脚手架的内置页面。

## 业务组件

抽离组件是开发中会经常需要处理的问题, 如果一个功能具有一定的复用性和复用必要, 或者满足如下的描述, 建议将其抽象为组件:

- 负责的是相对**独立**且**稳定**的功能
- 无需单独配置路由
- 可能是纯静态, 也可能有自己的state, 亦或由完全由父组件驱动

下面以一个图片展示组件为例, 该组件包含了图片和描述基本内容, 以及内外边距等内容

### 新建文件

在 src/components 文件夹下新建一个以组件名命名的文件夹，注意 **首字母大写**，命名尽量体现组件的功能，这里就叫 `ImageWrapper`。在此文件夹下新增 js 文件及样式文件（如果需要），命名为 `index.js` 和 `index.less`。

组件默认会在 `index.js` 中寻找 `export` 的对象, 所以如果你的组件比较复杂, 可以分开引入并由 `index.js` 统一 `export`

现在给 `index.js` 中添加一些代码:

```jsx
// index.ts
import React from 'react';
import styles from './index.less'; // 按照 CSS Modules 的方式引入样式文件。

export default ({ src, desc, style }) => (
  <div style={style} className={styles.imageWrapper}>
    <img className={styles.img} src={src} alt={desc} />
    {desc && <div className={styles.desc}>{desc}</div>}
  </div>
);
```

别忘了 `index.less`

```less
// index.less
.imageWrapper {
  padding: 0 20px 8px;
  background: #f2f4f5;
  width: 400px;
  margin: 0 auto;
  text-align: center;
}

.img {
  vertical-align: middle;
  max-width: calc(100% - 32px);
  margin: 2.4em 1em;
  box-shadow: 0 8px 20px rgba(143, 168, 191, 0.35);
}
```

### 使用组件

在需要使用的地方按照正确的路径引入即可使用, 注意正确的参数

```jsx {2}
import React from 'react';
import ImageWrapper from '@/components/ImageWrapper'; // @ 表示相对于源文件根目录

export default () => (
  <ImageWrapper src="someURL" desc="示意图" />
);
```

## 样式处理

样式在开发过程中, 仍有几点比较明显的痛点:

**全局污染**
css的选择器是全局生效, 不同于vue中的scope, react中则是根据build的先后顺序决定那些生效与否
**复杂选择器**
通常为了避免污染, 书写样式时通常会进行选择器嵌套, 以确保样式仅在需要的作用域内生效, 这就导致选择器越写越长, 深度也越写越深

为了解决以上两点, 脚手架采取了 **CSS Modules** 模块化方案:

### CSS Modules

```js {4}
// example.js
import styles from './example.less';

export default ({ title }) => <div className={styles.title}>{title}</div>;
```

```less {3}
/* example.less */
.title {
  color: @heading-color;
  font-weight: 600;
  margin-bottom: 16px;
}
```

你应该发现了其实用 less 写样式好像跟以往没啥区别，只是类名比较简单（实际项目中也是这样），不同的地方在于js中的 `className` 使用方法，用一个对象属性取代了原来的字符串，属性名跟 less 文件中对应的类名相同，对象从 less 文件中引入。

在上面的样式文件中，`.title` 只会在本文件生效，你可以在其他任意文件中使用同名选择器，也不会对这里造成影响。

如果你想实现全局的样式, 可以使用 **`:global`**。

```less {15-17, 20-27}
// example.less
.title {
  color: @heading-color;
  font-weight: 600;
  margin-bottom: 16px;
}

/*
也可以写出隐藏的关键字local
:local(.title) {
  color: @heading-color;
  font-weight: 600;
  margin-bottom: 16px;
}
*/

/* 定义全局样式 */
:global(.text) {
  font-size: 16px;
}

/* 定义多个全局样式 */
:global {
  .footer {
    color: #ccc;
  }
  .sider {
    background: #ebebeb;
  }
}
```

CSS Modules 的基本原理很简单，就是对每个类名（非 `:global` 声明的）按照一定规则进行转换，保证它的唯一性。如果在浏览器里查看这个示例的 DOM 结构，你会发现实际渲染出来是这样的：

```html
// 类名后有一个自动添加的hash值
<div class="title___3TqAx">title</div>
```

::: tip 建议
CSS Modules 只会对 `className` 和 `id` 进行转换, 其他选择器 **均不进行处理**, 推荐使用 `className`。

你的类名可以在保证语义化的前提下尽量简单。
:::

### 覆盖组件样式

如果你想要的单独在某个页面内对已有的样式进行覆盖或重写, 同样的需要使用 `:global` 进行覆盖, 但是这个覆盖式全局式污染的, 所以需要限制其生效的范围

```jsx {3, 13-20}
// TestPage.js
import { Select } from 'antd';
import styles from './TestPage.less';
const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

ReactDOM.render(
  <Select // 此处AntD将生成一个额外的类名 如同Element一样 在下面less文件中会使用
    mode="multiple"
    style={{ width: 300 }}
    placeholder="Please select"
    className={styles.customSelect}
  >
    {children}
  </Select>,
  mountNode,
);
```

```less {4}
// TestPage.less
.customSelect {
  :global {
    .ant-select-selection { // AntD 所生成的类名
      max-height: 51px;
      overflow: auto;
    }
  }
}
```

这里提供了CSS Modules 的源码和拓展阅读:

[github/css-modules](https://github.com/css-modules/css-modules)
[CSS Modules 用法教程 By 阮一峰](https://www.ruanyifeng.com/blog/2016/06/css_modules.html)
[CSS Modules 详解及 React 中实践](https://github.com/camsong/blog/issues/5) __← 推荐阅读这个__

## 数据交互

Ant Design Pro 可通过API和任何技术栈的服务端一起工作。这里先介绍交互流程时如何工作的, 然后再引入mock的使用方法。

### 请求流程

1. UI 组件交互操作；
2. 调用 model 的 [effect](https://dvajs.com/api/#effects)；
3. 调用统一管理的 service 请求函数；
4. 使用封装的 request.ts 发送请求；
5. 获取服务端返回；
6. 然后调用 reducer 改变 state；
7. 更新 model。

为了方便统一维护, 统一的请求处理都放在 **service** 文件夹中, 并按照 model 纬度进行拆分文件, 例如在 src\service 文件夹下的缺省文件:

service
├── login.js
└── user.js

::: tip 提示
utils/request.js 是基于 fetch 的封装, 用于统一处理POST, GET等请求参数、请求头以及错误处理等内容。
具体可以在源码中查看。
:::

那么, 现在我们来创建数据流所需的 model 和 service

```js
// services/user.js
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
```

```js {5-9}
// models/user.js
import { queryCurrent } from '../services/user';
...
effects: {
  *fetch({ payload }, { call, put }) {
    ...
    const response = yield call(queryCurrent);
    ...
  },
}
```

可以通过阅读这篇内容来理解这里的生成器: [迭代器 & 生成器](./../JavaScript/Set&Map.md)

### 异步请求的处理

在处理复杂的异步请求的时候，很容易让逻辑混乱，陷入嵌套陷阱，所以 Ant Design Pro 的底层基础框架 dva 使用 `effect` 的方式来管理同步化异步请求：

```js
effects: {
  *fetch({ payload }, { call, put }) {
    yield put({
      type: 'changeLoading',
      payload: true,
    });
    // 异步请求 1
    const response = yield call(queryFakeList, payload);
    yield put({
      type: 'save',
      payload: response,
    });
    // 异步请求 2
    const response2 = yield call(queryFakeList2, payload);
    yield put({
      type: 'save2',
      payload: response2,
    });
    yield put({
      type: 'changeLoading',
      payload: false,
    });
  },
},
```

也可以看这里的关于 [dva async Logic](https://github.com/dvajs/dva/blob/master/docs/GettingStarted.md#async-logic) 描述

## Mock 和联调

明白了如何请求和使用数据后, 我们可以直接访问线上的接口来开发程序, 但受限于服务端同样需要开发的问题经常会受服务端开发的阻碍, 所以我们不放通过预先约定好的接口, 模拟数据以及操作回调等逻辑, 将前端开发完全独立出来, 这就是mock的意义。

在AntD Pro中, umi自带了 **代理请求** 的功能, 从而轻松实现数据处理以及模拟的功能。

### 使用 umi 的 mock

umi 约定 mock 文件夹下的 **文件** 即是 **mock文件**

当客户端发起请求时, 如果匹配到了 `Get /api/users`, 本地启动的运行项目会根据mock根据匹配的内容进行处理, 可以直接返回数据(如下面的例子), 也可以通过函数处理以及重定向到另一个服务器。

```js
export default {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET POST 可省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => {
    res.end('OK');
  },
};
```

### 模拟延迟

可以直接在上述回调方法中添加 `setTimeout` 即可实现延迟, 但是如果需要全局添加延迟就是非常不必要且重复的工作了, 我们可以使用第三方插件 [roadhog](https://github.com/sorrycc/roadhog) 来完成这个工作:

```js
// some mock.js
import { delay } from 'roadhog-api-doc';

const proxy = {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/notices': getNotices,
};

// 调用 delay 函数，统一处理
export default delay(proxy, 1000);
```

### 联调

当本地开发完毕之后，如果服务器的接口满足之前的约定，那么只需要关闭 mock 数据或者代理到服务端的真实接口地址即可。

```text
npm run start:no-mock
```

本文档由 [Ant Design Pro](https://pro.ant.design/docs/getting-started-cn) 提炼而来。 