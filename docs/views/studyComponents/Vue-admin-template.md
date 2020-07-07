---
title: vue-admin-template 开发指南
date: 2020-06-19
categories:
 - 扩展
 - 框架
tags:
 - Vue
 - Vue-Cli 3.x 
 - ElementUI
 - polyfills
---

完整的后台解决方案, 易用, 模板化, 简单粗暴
<!-- more -->

## 为什么是template?

选用模板化的 [vue-admin-template](https://github.com/PanJiaChen/vue-element-admin) 是因为它足够简介, 更具有无限的拓展空间, 同时也不用担心包过于厚重的问题, 直接使用 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) 会附带业务中不需要的内容, 进而需要依次去排查并删除, 容易造成误删包导致无法运行的尴尬。

## 创建资源

在 [Github]() 上 `clone` 最新的 **模板代码** 或者直接下载 [vue-admin-template](https://github.com/PanJiaChen/vue-element-admin) 的源码, 

下载完成安装依赖, 使用npm换源 (使用cnpm可能会出现不可预知的错误)

```
npm install --registry=https://registry.npm.taobao.org
```

安装完成后运行

```
npm run dev
```

浏览器中能正常打开就算完成了第一步~

## 开始开发

### 添加一个页面

在src/views 中 添加页面, 注意分文件夹, 一些全局通用的页面可以无需放入子文件夹中, 例如404页; 我们以一个 '人员管理(userManage)' 页为例

``` {3-5}
  src
    views
      *userManage
        *index.vue
        *UserDetail.vue
```

::: warning 规范
1. 文件夹命名采用 **小驼峰**
2. .vue文件除了index.vue以外, 使用 **大驼峰**
3. 根据情况放置index.vue, 如果是单个页面则直接放一个index.vue, 多级页面时, 每一级都需要index.vue
:::

如果在本模块( userManage ) 中, 如果需要维护模块内的工具类和组件等, 在当前文件下创建 **utils** 和 **components** 文件夹即可(* 注意组件必须要是用 **大驼峰**, 工具类使用 **小驼峰** )

### 注册路由

添加完页面后, 要将其注册到路由上, 导航和面包屑等才能正确地引导用户进入页面

路由在 src/router/index.js 中进行配置, 路由由两部分组成:

* constantRoutes 完全静态的路由, 所有权限的用户登录均可查看
* asyncRoutes 动态路由, 根据用户角色进行条件渲染, 后续会介绍如何配置

我们暂且将刚刚的页面注册到静态路由中去

```js {11,23,30}
// router.js
export const constantRoutes = [
  ...
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/userManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'UserManage',
        component: () => import('@/views/userManage/index'),
        meta: {
          title: '用户管理',
          icon: 'user'
        }
      },
      {
        hidden: true, // 在导航中隐藏
        path: 'index/detail',
        name: 'UserDetail',
        component: () => import('@/views/userManage/UserDetail'),
        meta: {
          title: '用户详情', // 虽然不在导航中显示, 但最好还是描述清楚功能
          activeMenu: '/userManage/index' // 高亮对应的导航
        }
      }
    ]
  }
]
```
你可能注意到了 `component` 是 `Layout`, 它可以便捷的指定当前页是否包含布局, 如果你不需要布局时, 则可以不嵌套这一层内容, 直接用component指定你的.vue文件, 就像这个login页一样

```js {5}
// router.js
...
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
...
```

::: warning 规范
1. router的name属性必须保证其唯一性, 命名法则采用 **大驼峰**
2. 当children中的可见路由(hidden != true)数量 > 1 时, 菜单将显示为可展开的样式, 并且他本身是不能选中的; 反之, 它将直接作为一个 **一级功能**
3. 你可以参考如上的方式配置一个没有子菜单的 **一级功能**, 但是其拥有一个详情页, 详情页拥有导航高亮的属性, 这需要你手动配置一下
:::

### 添加api

通常每一个完整的page页都应分配一个api, 最佳的实践方式是每个页面用文件夹存放其api;

如果有全局复用的api, 则可以直接放置于 `src/api` 的根目录, 注意按实际功能含义进行命名。

::: warning 注意
* 每一个api 都应引入request, 便于全局管理
* export需 每个function分别导出, 便于引入时解构
:::


## Element相关

`ElementUI` 是比较灵活的组件库, 几乎每个组件都提供了众多可定制化的内容, 例如尺寸, 显示控制, 组件位置等, 为了统一, 有如下的内容需要遵循:

### 全局配置

Element支持 [全局配置项](https://element.eleme.cn/2.13/#/zh-CN/component/quickstart#quan-ju-pei-zhi), 但是目前仅支持 `size` 和 `zIndex` 属性, 本框架配置了

```js
{
  size: 'small',
  zIndex: 3000
}
```

### SCSS Variable

`Element` 除了支持修改上述的全局配置项, 还可以利用SCSS的变量特性, 修改已暴露的样式变量值, 以达到快速修改主题或全局调整的效果, 所有暴露的变量都在 `element-ui/packages/theme-chalk/src/common/var.scss` 中, 你可以随时前往源码查看, 请注意 **不要修改** 该文件。

\* `var.scss` 的内容已复制并归类整理到本站, 点击 [这里](../summary/ElementSCSSVariables.md) 查看。

### type对应color

Button, Link, Badge, $message 等组件, 具有通过指定 `type` 来快速应用全局颜色的配置, 在使用他们时, **不要直接通过CSS修改颜色**, 如果发现了颜色有误差, 为了确保一致性应找寻UI及时调整全局颜色, 而不是直接写上新的颜色code。

颜色是依照这样的模式混合的:

```scss

...
$--color-success-light: mix($--color-white, $--color-success, 80%) !default;
$--color-warning-light: mix($--color-white, $--color-warning, 80%) !default;
$--color-danger-light: mix($--color-white, $--color-danger, 80%) !default;
$--color-info-light: mix($--color-white, $--color-info, 80%) !default;

$--color-success-lighter: mix($--color-white, $--color-success, 90%) !default;
$--color-warning-lighter: mix($--color-white, $--color-warning, 90%) !default;
$--color-danger-lighter: mix($--color-white, $--color-danger, 90%) !default;
$--color-info-lighter: mix($--color-white, $--color-info, 90%) !default;
...

```

以上代码同样在 [var.scss#color](../summary/ElementSCSSVariables.md#color-颜色) 中, 你可以随时查看。

::: warning 注意
Tag, Button(plain) 等组件, 采用的是混合后的light颜色, 而不是直接颜色, 需要修改时应修改其对应的 **混合比例**, 而 **不是** 直接修改参与混合的颜色
:::


## 其他
  
### js浮点数问题

当你的计算代码输出结果可能会出现 **浮点数** 时, 由于JS本身的缺陷, 且为了确保结果准确无误, 必须使用 [Big.js](https://github.com/MikeMcl/big.js) 进行处理, 如果 _结果_ 或 _参与运算的数值_ **一定** 为整数, 则无需使用 Big.js。

以下是一些基本的示例代码:

```js {1-2}
const x = new Big('0.3') // 可以接收字符串
console.log(Number(x.add(0.1).minus('0.2').times(0.3))) // 方法内的参数同样可以使用字符串
console.log(Number(x))
console.log(x.toString())
console.log(Big(0.3).add(0.1))
```


Big.js 的常用方法:
* 这里有初始值 `a = new Big(1024.123456)`

方法名|功能描述|返回值描述|返回值类型|示例
:-|:-|:-|:-|:-
add() / plus()|加 **+**|计算结果|**Object**|-
minus()|减 **－**|计算结果|**Object**|-
times()|乘 **×**|计算结果|**Object**|-
div()|除 **÷**|计算结果|**Object**|-
sqrt()|开根号 **√**|计算结果|**Object**|-
pow(n)|次方 **aⁿ**|计算结果|**Object**|-
eq()|等 **&#61;**|比较结果|**Boolean**|-
lt()|小于 **&lt;**|比较结果|**Boolean**|-
gt()|大于 **&gt;**|比较结果|**Boolean**|-
toPrecision()|精度|处理结果|**String**|a.toPrecision(5) >> 1024.1
toFixed()|小数点精度|处理结果|**String**|a.toFixed(5) >> 1024.12345
round()|小数点精度|处理结果|**Object**|a.round(5).toString() >> 1024.12345

::: warning 注意
Big.js 采用链式的计算方法, 意味着正常的计算优先级将不复存在, 你需要手动调整代码的顺序来控制其计算的顺序。
:::

### 注释

每一个 methods 内方法都应该有注释, 需要描述清楚方法的基本功能

```js
/**
 * 这是方法描述
 * /
```

如果方法内部执行的内容较多, 或者做了一些特殊处理, 需要在对应的地方写明

```js
  // 可以在代码片段开始前添加注释, 标注直到下一个空行前的代码片段 或者是方法/代码块结束
  some code 
  some code // 这里是行注释, 仅标注这一行(本段代码结束, 下方是空行)

  another code
```

### vuex

框架使用了 vuex 作为状态管理工具, 在需要使用或修改全局状态的页面中直接引入需要的辅助函数即可:

例如 `mapGetters` 来获取 `getter`:
```js
  ...
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
  ...
```

::: tip 建议
你也可以在自定义 `state` 与 `getter` 等, 但是需要遵从以下几点原则:
* **按需存储**: 只保存需要全局使用的状态, 局部状态请用当前页保存或参数传递
* **精确存储**: 不保存不需要的状态, 冗余内容不要存储
* **不重复存储** 如果在别的状态中已有包含的内容, 请勿重复保存
:::

\* 更多辅助函数前往 [vuex 辅助函数](https://vuex.vuejs.org/zh/api/#%E7%BB%84%E4%BB%B6%E7%BB%91%E5%AE%9A%E7%9A%84%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0) 查看。


### 不再使用的的slot属性

vue.js 从2.6.0+开始, 彻底废弃或移除了 [slot & slot-scope & scope](https://cn.vuejs.org/v2/api/index.html#slot-%E5%BA%9F%E5%BC%83) 这三个特殊属性, 但在elementUI文档中仍在使用 `slot-scope` 作为演示代码, `slot-scope` 未移除但是已经不被建议使用，为了适应框架和统一, 需要采用最新的写法 `v-slot`。

```js
// 这里是具名插槽， 插槽名可以为空
<template v-slot:slotName="xxx">
...
</template>
```

前往官方文档查看 [v-slot](https://cn.vuejs.org/v2/api/index.html#v-slot) 的更多内容。

### 浏览器兼容

本框架已经做了浏览器的兼容（ployfills）， 通常最低只需要兼容IE 9+， 只需要再 package.json 中配置 `browserlist` 数组：

```js {3}
"browserslist": [
    "> 1%",
    "ie 9",
    "last 2 versions"
  ]
```

\* 如何在vue-cli 3.x 项目中手动配置 polyfills 可以查看 [这里](../summary/Polyfills.md)。