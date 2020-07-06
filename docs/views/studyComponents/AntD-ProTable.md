---
title: Ant Design 的 ProTable
date: 2020-06-11
categories:
 - 扩展
 - 组件
 - 框架
tags:
 - React
 - Ant Design
 - Ant Design Pro
 - Umi 3.x
---

<!-- 还在纠结重复写表格一遍又一遍吗, 来试试ProTable! -->

## 大量重复的CURD开发工作?

AntD 虽然提供了功能强大的表格组件, 但在实际开发中, 开发人员为了完成CURD的基础功能, 必须得完成基础功能的开发例如: 表格顶部的查询表单, 多个搜索条件的配置, 新增按钮, 数据枚举, 数据过滤, 分页等, 这些工作重复且会添加很多重复的代码用于实现这些功能, 于是ProTable应运而生。

## 值类型

ProTable 封装了一些常用值的类型, 指定了值类型的列中的value会进行一些格式化操作, 例如: 添加格式化字符'¥', 格式化时间戳, 格式化样式, 转化表格的查询表单等:

类型 | 描述 | 示例
:- | :- | :-
money | 转化值为金额 | ¥10,000.26
date | 日期 | 2019-11-16
dateRange | 日期区间 | 2019-11-16 2019-11-18
dateTime | 日期和时间 | 2019-11-16 12:50:00
dateTimeRange | 日期和时间区间 | 2019-11-16 12:50:00 2019-11-18 12:50:00
time | 时间 | 12:50:00
option | 操作项，会自动增加 `marginRight`，只支持一个数组,表单中会自动忽略 | `[<a>操作a</a>, <a>操作b</a>]`
text | 默认值，不做任何处理 | -
textarea | 与 `text` 相同， `form` 转化时会转为 `textarea` 组件 | -
index | 序号列 | -
indexBorder | 带 `border` 的序号列 | -
progress | 进度条 | -
digit | 单纯的数字，`form` 转化时会转为 `inputNumber` | -
percent | 百分比 | +1.12
code | 代码块 | `const a = b` 
avatar | 头像 | 展示一个头像


## Columns

定义列columns时 有如下属性可以使用：

属性 | 描述 | 类型 | 默认值
:- | :- | :- | :-
**valueEnum** | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | valueEnum | -
**valueType** | 值的类型 | `'money' \| 'option' \| 'date' \| 'dateTime' \| 'time' \| 'text'\| 'index' \| 'indexBorder'` | 'text'
**hideInSearch** | 在查询表单中不展示此项 | boolean | -
**hideInTable** | 在 Table 中不展示此列 | boolean | -
**formItemProps** | 查询表单的 props，会透传给表单项 | `{ [prop: string]: any }` | -
**renderFormItem** | 渲染查询表单的输入组件 | `(item,props:{value,onChange}) => React.ReactNode` | -
**dataIndex** | 指定在对象数据中读取值的字段名 | string | -
**key** | 用于重定义查询表单使用的字段名| string | `dataIndex` 的值
**ellipsis** | 是否自动缩略 | boolean | -
**copyable** | 是否支持复制 | boolean | -
**width** | 列的宽度，可不指定 | number | -
**order** | 决定在 查询表单中的顺序，越大越在前面 | number | -

## Request

proTable的数据由request来驱动，他有内置参数, 即是当前的表单搜索条件和分页的内容, 所以你只需要在其中添加你自己的请求数据的方法即可:

```jsx
...
request={params => getData(params)} // getData in service.js
...
```


## Render

你可以理解为这就是Vue中的插槽, 在此方法中 `return` 组件, 并执行相关操作:

```jsx
const columns = [
  ...
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, tableRow) => (
      <>
        <a
          onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(tableRow);
          }}
        >
          操作按钮
        </a>
        <Divider type="vertical" />
        <a href="">别的操作按钮</a>
      </>
    ),
  },
  ...
]
```
## RenderText

其实就是已更便捷的方式输出处理后的文本, 等同于在Vue template中写 `function`: 

```js {7}
const columns = [
  ...
  {
    title: '服务调用次数',
    dataIndex: 'callNo', // data key 
    sorter: true, // enable sort
    renderText: val => `${val} 万`, // render function
  },
  ...
]
```

## ValueEnum

在colums中可以直接设置映射, ProTable将根据匹配的值进行自动处理, 直接显示枚举所配置的文本。

```js {8-13}
const columns = [
  ...
  {
    title: '状态',
    dataIndex: 'status', 
    initialValue: 'all', // default value
    width: 100,
    valueEnum: { // 列出映射的枚举 'value': { text: '文本', status: '状态码, 对应Color'}
      0: { text: '关闭', status: 'Default' },
      1: { text: '运行中', status: 'Processing' },
      2: { text: '已上线', status: 'Success' },
      3: { text: '异常', status: 'Error' }
    }
  },
  ...
];
```

::: tip 注意
\* 配置了枚举的列, 在自动生成 [查询表单](../studyComponents/AntD-ProTable.md#查询表单) 项时, 会根据枚举值生成 `Select组件`, 并默认选中`all` 这个初始值
:::

## ToolBarRender

这是一个专门的 `render` , 用于创建顶部的操作栏内的内容。

`toolBarRender` 支持返回一个 `ReactNode` 数组，会自动地增加间隔等样式，`toolBarRender` 提供 `action` 与当前选中的列等数据，方便进行一些快捷的操作。代码看起来是这样的:

```jsx 
<ProTable
  ...
  toolBarRender={(action, { selectedRows }) => [
    <Button icon={<PlusOutlined />} type="primary" onClick={() => handleModalVisible(true)}>
      新建
    </Button>,
    selectedRows && selectedRows.length > 0 && (
      <Dropdown
        overlay={
          <Menu
            onClick={async e => {
              if (e.key === 'remove') {
                await handleRemove(selectedRows);
                action.reload();
              }
            }}
            selectedKeys={[]}
          >
            <Menu.Item key="remove">批量删除</Menu.Item>
            <Menu.Item key="approval">批量审批</Menu.Item>
          </Menu>
        }
      >
        <Button>
          批量操作 <DownOutlined />
        </Button>
      </Dropdown>
    ),
  ]}
/>
```

## 查询表单

通常在表格出现的地方就有用于搜索的表单, ProTable同样内置, 它完全根据你的columns来自动生成。

但是往往理想很丰满, 现实是有时候只需要一两个查询条件甚至直接不需要查询, 这个时候可以通过 `formItemProps ` 配合 `renderFormItem` 来实现

* `formItemProps` 可以把 `props` 透传，可以设置 `select` 的样式和多选等问题。

* `renderFormItem` 可以完成重写渲染逻辑，传入 `item` 和 `props` 来进行渲染，需要注意的是我们必须要将 `props` 中的 `value` 和 `onChange` 必须要被赋值，否则 `form` 无法拿到参数。

这里有个完整的例子: 

```jsx
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Input } from 'antd';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';

// 定义列
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'indexBorder', // 指定值类型, 参考本文前面的列表
    width: 72,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true, // 显示快捷拷贝按钮
    ellipsis: true, // 溢出显示省略号
    width: 200,
    hideInSearch: true, // 可以直接将此列从查询表单中隐藏
  },
  {
    title: '状态',
    dataIndex: 'state',
    initialValue: 'all',
    valueEnum: { // 枚举映射
      all: {
        text: '全部',
        status: 'Default',
      },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '排序方式',
    key: 'direction', // 定义在用于表单搜索时的字段名, 没有指定时默认使用 'dataIndex' 的值
    hideInTable: true,
    dataIndex: 'direction',
    valueEnum: { // 除了上述对象类型的映射, 也可以直接映射字符
      asc: '正序',
      desc: '倒序',
    },
    renderFormItem: (column, { type, defaultRender, ...rest }, form) => {
      console.log('item:', column);
      console.log('config:', {
        type,
        defaultRender,
        ...rest,
      });
      console.log('form:', form);
      if (type === 'form') {
        return null;
      }
      const status = form.getFieldValue('state');
      if (status !== 'open') {
        return <Input {...rest} placeholder="请输入" />;
      }
      return defaultRender(column);
    },
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: 120,
    render: (_, row) => (
      <Space>
        {row.labels.map(({ name, id, color }) => (
          <Tag color={color} key={id}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'created_at',
    valueType: 'dateTime',
  },
  {
    title: 'option',
    valueType: 'option',
    dataIndex: 'id',
    render: (text, row) => [
      <a href={row.html_url} target="_blank" rel="noopener noreferrer">
        查看
      </a>,
      <TableDropdown
        onSelect={key => window.alert(key)}
        menus={[
          {
            key: 'copy',
            name: '复制',
          },
          {
            key: 'delete',
            name: '删除',
          },
        ]}
      />,
    ],
  }
]

export default () => (
  <ProTable
    columns={columns}
    request={async (params = {}) =>
      request('https://proapi.azurewebsites.net/github/issues', {
        params,
      })
    }
    rowKey="id"
    dateFormatter="string"
    headerTitle="查询 Table"
    search={{
      collapsed: false,
      optionRender: ({ searchText, resetText }, { form }) => (
        <>
          <a
            onClick={() => {
              form.submit();
            }}
          >
            {searchText}
          </a>{' '}
          <a
            onClick={() => {
              form.resetFields();
            }}
          >
            {resetText}
          </a>{' '}
          <a>导出</a>
        </>
      ),
    }}
    toolBarRender={() => [
      <Button key="3" type="primary">
        <PlusOutlined />
        新建
      </Button>,
    ]}
  />
);
```
## 无需分页

在ProTable中, 无需再书写分页组件, 也就省略了分页的一系列 事件响应 以及 分页记录 的代码:

默认的分页参数:

```js
current: 1
pageSize: 10
```