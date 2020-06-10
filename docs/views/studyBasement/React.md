---
title: React 入门
date: 2020-05-29
categories:
 - 基础
 - 教程
tags:
 - React
desc: 本md文档使用了vuepress扩展, 移植时需要注意格式
---

~~从入门到放弃~~

<!-- more -->
## 快速开始

### 通过标签引入
可以将下载好的react文件通过标签直接引入
`<script src="url"></script>`

### 工具链
React团队推荐的工具链

* 如果你是在学习 React 或创建一个新的单页应用，请使用 [Create React App](https://react.docschina.org/docs/create-a-new-react-app.html#create-react-app)。
* 如果你是在用 Node.js 构建服务端渲染的网站，试试 [Next.js](https://react.docschina.org/docs/create-a-new-react-app.html#nextjs)。
* 如果你是在构建面向内容的静态网站，试试 [Gatsby](https://react.docschina.org/docs/create-a-new-react-app.html#gatsby)。
* 结合实际开发需要, 当然有直接集成好的脚手架会是更好的选择, 如 [Ant Design Pro](https://pro.ant.design/index-cn)。


### Create React App
由于是从头学习 React, 本文推荐 Create React App 此工具链, 从头开始搭建一个新的单页应用, 理解React的基本内容。

使用前请确保本机Node >= 8.10 && npm >= 5.6

确认完成后 依次执行
``` 
npm install create-react-app -g

npx create-react-app my-app
// or
npm init react-app my-app

cd my-app
npm start
```

进入文件目录, 可以查看自动生成的文件目录
```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js // 入口js
    ├── logo.svg
    └── serviceWorker.js
```

至此一个极简的React应用就搭建好了, 你可以在后续的文档学习中实践, 想要了解更多点击这里 [Create React App 中文文档](https://www.html.cn/create-react-app/)。
## JSX

```jsx
const element = <h1>Hello, world!</h1>;
```

JSX 既不是字符串也不是 HTML, 是一个 JavaScript 的语法扩展, JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。

```jsx
const name = 'Josh Perez';
const element = <h1>Hello, { name } </h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

大括号内放置任何有效的 JavaScript 表达式, 类似于Vue中的双大括号。

**JSX 也是一个表达式**

可以在 if 语句和 for 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}</h1>;
  }
  return <h1>Hello, Stranger</h1>;
}
```

**Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。**
```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
// 上下等效
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

## 元素的渲染

**元素是构成 React 应用的最小单元。**

根节点内的所有内容都将由 React DOM 管理, 类似Vue实例: 架构产生单页应用 , 引用则可以产生多个实例

React 元素是**不可变对象**。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。
更新 UI 唯一的方式是创建一个全新的元素，并将其传入 `ReactDOM.render()`。

```jsx
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```
上例为一个简单计时器, 但 **React 只更新它需要更新的部分**, 在 `state` 的章节会对此进行优化

## 组件 & Props

概念上类似于 JavaScript 函数。它接受任意的参数（即 `props` ），并返回用于描述页面展示内容的 React 元素

::: warning 注意
组件名称必须以大写字母开头。
:::

这个参数可以是简单的基本数据类型, 也可以是复杂对象 和 函数。


```jsx
// 这两个组件在现在看来完全等效, 但其延伸方向有稍微有区别, 将在下一小节详细说明
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### class组件
最常见的组件, 类似Vue中的组件, 持有state状态管理, 继承了 `React.component` 。
此时在组件内 `this` 指向当前组件本身

```jsx {3}
  class MyComponent extends React.Component {
    constructor(props) {
      super(props) // 固定调用超类
    }

    someMethod() {
      // Doing Something
      console.log(this.props)
    }

    render() {
      return (
        <h1>Hello, {this.props.name}</h1>
      )
    }
  }
```

::: danger 警告
和VUE组件相同的是, props内的数据都不应去直接修改, 而是用state维护
:::

### 函数组件
不同于普通的组件, 虽然同样可以输出 `ReactDOM`, 但其没有自身的state, 仅能从父组件处获取 `props` 的值, 可以理解为被父组件控制。

函数组件的具有 数据统一, 单向数据流, 直观等优点; 事实上, 可以尽量多的使用函数组件来代替class组件, 这可以极大的减少不必要的代码量和理解难度。

### 组合组件

组件可以在自身内部引用别的组件，也可以任意嵌套, 在JSX中可以直接使用想要的组件
```jsx {8}
// 这里使用了函数组件, 函数组件非常适合作为子组件
function Child(props) {
  return <p>I'm child NO.{props.value} </p>;
}

class Father extends React.Component {
  constructor(props) {
    super(props)
    this.state.value = 666
  }

  render() {
    return <Child className="xx-xx" xx={this.state.value}/>;
  }
}
```

### Props 只读

不修改入参的函数称为 **纯函数**, 所有React组件都不应该修改入参, 下一节将介绍`state`，可以辅助完成被纯函数限制的内容

React 非常灵活, 但有一条严格的规则:

::: danger 警告
所有 React 组件都必须像纯函数一样保护它们的 props 不被更改
:::

## state & 生命周期

### state

在之前的计时器例子中, 通过反复调用 `tick()` 来重复渲染ReactDOM, 以达到视觉和数据更新的目的, 本章节将介绍state来代替这种笨重的写法。

State和props类似, state可完全自定义, 并且完全受控于当前组件。

先将之前的例子从函数组件变为class组件:
```jsx
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

向构造函数添加state, 并取消在父组件的入参 `date`, 同时提取`Clock`组件, 完成后代码:

```jsx {11}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

### 生命周期

当页面组件过多时, 在组件被销毁时释放资源非常重要。

当组件第一次被渲染到DOM中时, 在React中被称之为 '挂载'(mount)
当组件被删除时, 其占用的资源被释放, 在React中被称之为 '卸载'(unmount)

与Vue相同的是, 生命周期都有对应的hook函数, 在React中被称为'生命周期方法', 例如:

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  // 挂载完成后执行, 特殊方法, 保留函数名
  componentDidMount() {
  }

  // 卸载前执行, 特殊方法, 保留函数名
  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

### State的正确打开方式

#### 1. 非响应式的State

```jsx
// Wrong
this.state.comment = 'Hello';

// Correct
this.setState({comment: 'Hello'});
```

::: warning 注意
构造函数是唯一可以给 `this.state` 赋值的地方
:::

#### 2. State的更新可能是异步的

React可能会把多个 `setState()` 合并成一个进行调用

::: warning 注意
`this.props` 和 `this.state` 可能会异步更新, 所以不要期望为同步调用
:::

```jsx
// Wrong
// counter 可能会无法更新
this.setState({
  counter: this.state.counter + this.props.increment,
});

// Correct
// 由对象 改为 函数
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

这样在每次更新时触发对应的函数, 即使异步也不会影响。

#### 3. 向下流动的数据

任何组件都无法知道自身使用的子组件是有还是无状态的, 也不关心是函数组件还是class组件。

任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。

## 事件处理

**React 元素的事件处理和 DOM 元素的很相似，但是有一点语法上的不同：**


* React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
* 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

```jsx
// HTML 的事件处理
<button onclick="someFunction()">
  doSomething
</button>

// React 的事件处理
<button onClick={someFunction}>
  doSomething
</button>
```

### 事件基础

当你创建了一个class组件时, 通常事件处理函数应直接定义为class内的方法
```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    // 在通常回调函数中, this == undefined, 故需要bind(this)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }
  handleSecondClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
        <button onClick={this.handleSecondClick.bind(this)}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

在上方代码中, 列举了两种绑定 `this` 的方法, 两种写法等效, 其中 `handleSecondClick` 更常用于更直观的参数传递(下一节)

在 JavaScript 中，`class` 的方法默认不会绑定 `this`。如果你忘记绑定 `this.handleClick` 并把它传入了 `onClick`，当你调用这个函数的时候 `this` 的值为 `undefined`。

也可以使用实验性的语法 [public class fields 语法](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/), Create React App 默认启用此语法。

```jsx
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

如果不想使用上述的语法, 也可以直接在回调中使用箭头函数

::: warning 箭头函数( => )的潜在问题:

使用箭头函数会导致每次都重新创建不同的回调函数, 通常情况下没有问题, 但如果将其作为 `props` 传入子组件时, 可能会导致子组件进行额外渲染, 故此方法其实并不推荐使用。

```jsx
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```
:::

同时由于组件化的模式, 在函数中 `return false` 无法阻止默认行为;
必须显示地调用 `preventDefault` 来中止, 已阻止a标签跳转为例。

```jsx
// 在普通HTML中
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>

// 在React组件中
function ActionLink() {
  function handleClick(e) {
    e.preventDefault(); // 显式调用
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

### 参数传递

实际开发流程中, 事件回调通常需要附带一个甚至多个参数

```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

在这两种情况下，React 的事件对象 e 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。

### 条件渲染

由于机制的不同, React中的条件渲染是由 '`if`' 或者 '条件运算符' 来控制不同组件之间的渲染逻辑, 而并非Vue中的指令式条件渲染。

以下是一个控制 '登录/登出' 的功能组件, 并根据状态显示相应的组件(对应的操作按钮以及问候语)。

```jsx
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    // 同样再次指定this
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        // 用表达式包裹的JSX
        {button} 
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```
上述条件判断方法是最基本的实现方式, 下面将介绍两种内联的条件渲染的方法, 类似Vue的指令式渲染。

### 与运算符 &&
同时利用 JSX 和 逻辑运算符&& 的特性

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

JSX对于运算符来说始终为true,:
```jsx
true && expression  // true
false && expression // false
```

### 三目运算符 ? :

基于前面的 && 运算符逻辑, 你可能会立即联想到同样有条件判断特性的三目运算符:
以下是一个简单的代码片段
```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

当然, 三目运算符也可以用于表达式的处理

```jsx
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

如果判断逻辑过于复杂, 应该考虑进行组件提取。

### 阻止条件渲染

在某些特殊情况下, 即使完成渲染的组件也有需要隐藏的需求, 实现方法也很简单, 直接在 `render` 中返回 `null` , 则不会渲染任何内容 !

```jsx
function WarningBanner(props) {
  if (!props.warn) {
    // 直接返回null, 不渲染
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        // 使用条件变量
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

在组件的 `render` 方法中返回 `null` 并不会影响组件的生命周期。例如，上面这个示例中，生命周期函数 `componentDidUpdate` 和 `componentDidMount` 等依然会被调用。

## 循环渲染 & Key

### 循环渲染

在React中的循环渲染, 同样是依托于JSX进行, 下面简单地使用 `map` 函数进行一个列表的循环渲染

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

这段代码可以成功运行, 但是会收到一条警告: `a key should be provided for list items`, 这表明你在循环输出时需要保证每一个元素需要有一个唯一的 `key` 属性。

```jsx
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

### Key

`key` 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

通常情况下一般使用数据源的唯一 "id", 保证数据不会变化的情况下可以使用索引 `index` 作为 `Key`, 但如果列表会发生顺序变化时, 会造成循环性能变差, 也可以查看这里[深入解析为什么 key 是必须的](https://react.docschina.org/docs/reconciliation.html#recursing-on-children)。

## 表单

在 React 里，表单元素通常会保持一些内部的 state。

```jsx
<form>
  <label>
    名字:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="提交" />
</form>
```
这是一个简单的表单, 他只接受了一个 `name`, 内容在其内部维护。

### 受控组件

在HTML中, 表单元素(`<input>`, `<textarea>`, `<select>`等)通常自己维护自身的state, 即存放于 `value` 中; 而在React中, 这些状态通常保存在组件的state中, 并且只能通过 `setState()` 来更新。

现在可以将上述两种 `state` 进行结合, 使React的 `state` 作为唯一数据源, 而非表单自身的 `state`。

**渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做 “受控组件” 。**

将刚刚的组件稍作修改:

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    // 初始化state
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 处理内容变化
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

对于受控组件来说，输入的值始终由 React 的 `state` 驱动。你也可以将 `value` 传递给其他 UI 元素，或者通过其他事件处理函数重置，但这意味着你需要编写更多的代码。

::: warning 注意
  你可以将数组传递到 value 属性中，以支持在 select 标签中选择多个选项：
  ```jsx
    <select multiple={true} value={['B', 'C']}>
  ```
:::

### 文件 input 标签

在 HTML 中，`<input type="file">` 允许用户从存储设备中选择一个或多个文件，将其上传到服务器，或通过使用 JavaScript 的 File API 进行控制。

因为它的 `value` 只读，所以它是 React 中的一个**非受控组件**。

### 受控输入空值

在受控组件上指定 `value` 的 prop 会阻止用户更改输入。如果你指定了 value，但输入仍可编辑，则可能是你意外地将value 设置为 undefined 或 null。

```jsx
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);
```
上述组件最开始无法修改, 延迟结束后变为可修改。

## 状态提升

通常, 多个组件需要对同一数据做出相应的反应, 这时则需要将状态提升到共同的父组件中去, 由父组件将数据流向子组件。

在本节中, 将通过一个实例: '计算水在用户输入的温度下是否会沸腾的温度计算器' 来进行逐一讲解。

### 基础功能
首先创建一个判断是否煮沸的函数组件: `BoilingVerdict`, 它接受一个摄氏度 `celsius` 作为 `prop`, 并以此作为条件判断是否煮沸。
```jsx
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>水可以煮沸!</p>;
  }
  return <p>水无法煮沸!</p>;
}
```

接下来创建一个用于计算温度的组件: `Calculator`, 它渲染了一个 `\<input\>`作为数据的输入源, 并将其维护在自身的 `state.temperature` 中。

然后, 再其内部渲染刚刚创建的 `BoilingVerdict` 组件。

```jsx
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    // 初始化数据
    this.state = {temperature: ''};
  }

  handleChange(e) {
    // 数据修改
    this.setState({temperature: e.target.value});
  }

  render() {
    // 数据引用
    return (
      <fieldset>
        <legend>请输入摄氏温度:</legend>
        <input
          value={this.state.temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(this.state.temperature)} />
      </fieldset>
    );
  }
}
```

这两个组件是简单的父子关系, 实现的功能也非常简单, 由 `Calculator` 组件流向 `BoilingVerdict` 中去。

### 新的功能

现在万恶的产品提出了新的需求: 在已有的摄氏度功能基础上, 添加华氏度的支持, 并且输入一种类型的温度自动生成另一种温度, 同时再判断水是否煮沸。

我们先从组件提取开始: 将原本基础的 `<input>`变为 `TemperatureInput` 组件, 然后为其添加单位的 `prop`

```jsx
// 定义单位
const scaleNames = {
  c: '摄氏度(Celsius)',
  f: '华氏度(Fahrenheit)'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale; // 接收单位信息
    return (
      <fieldset>
        <legend>输入的{scaleNames[scale]}为:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

修改 `Calculator` 组件中的input:

```jsx
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

输入框准备完毕后, 我们还需要一个转换两种温度的函数:

```jsx
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

然后再编写一个使用如上两个函数的函数, 这个函有两个参数: 第一个 `string`类型, 为输入的温度数据; 第二个 `function`类型, 为需要执行的操作函数。

```jsx
function tryConvert(temperature, convertFunction) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convertFunction(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

### 状态提升

现在的问题是, 两个输入框各干各的, 此外由于温度的数据都位于 `TemperatureInput` 中, 我们并不能在 `Calculator` 中进行计算。

在 React 中，将多个组件中需要共享的 `state` 向上移动到它们的最近共同父组件中，便可实现共享 `state`。这就是所谓的 **状态提升**。

但是, 由此一来会产生别的问题, 组件的 `prop` 是只读的, 当 `temperature` 存在于 `TemperatureInput` 组件的 `state` 中时, 组件调用 `this.setState()` 便可修改它。然而，`temperature` 是由父组件传入的 `prop`，`TemperatureInput` 组件便失去了对它的控制权, 即使你能利用 `prop` 创建副本也无法完全的控制 `prop`。

在React中, 这种问题通常是通过 "受控组件" 来解决的。

::: tip
与 DOM 中的 `<input>` 接受 `value` 和 `onChange` 一样，自定义的 `TemperatureInput` 组件接受 `temperature` 和 `onTemperatureChange` 这两个来自父组件 `Calculator` 的 `props`。

如果你觉得难以理解, 可以根据vue组件的事件向上广播 `@emit` 来进行辅助思考和理解。
:::

当 `TemperatureInput` 组件想要向上更新温度数据时, 只需要调用 `this.props.onTemperatureChange()`

```jsx
 handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
 }
```

::: warning 注意
自定义组件中的 `prop` 的命名是任意的, 并没有任何特殊含义, 所以使用 `value` 代替 `temperature` 、`onChange` 代替 `onTemperatureChange`也完全可以。
:::

`onTemperatureChange` 的 `prop` 和 `temperature` 的 `prop` 一样，均由父组件 `Calculator` 提供。它通过修改父组件自身的内部 `state` 来处理数据的变化，进而使用新的数值重新渲染两个输入框。

```jsx
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // onChange的回调, 将value的值作为参数调用props的函数, 就像vue的@emit一样
  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    // 使用父组件的prop
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>输入的{scaleNames[scale]}为:</legend>
        <input 
          value={temperature}
          onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

子组件 `TemperatureInput` 处理好了, 然后是父组件 `Calculator`, 父组件中持有 `temperature` 和 `scale` 这两个状态数据, 这就是由子组件所 "提升" 上来的数据, 他们是这样的:

```jsx
// 在摄氏度的输入框中输入 '123', 现在的Calculator组件中的state是这样的
{
  temperature: '123',
  scale: 'c'
}

// 在华氏度的输入框中输入 '12', 现在的Calculator组件中的state是这样的
{
  temperature: '12',
  scale: 'f'
}
```

::: tip 小建议
虽然可以用两个不同的变量存放这两个输入框的值, 但其实没有必要, 另外的值完全可以交给 `Calculator` 组件内部进行计算后传递给 `TemperatureInput` 组件。
:::

现在 你的 `Caculator` 组件变成了这样:

```jsx
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    // 初始化, 在事件绑定后
    this.state = {temperature: '', scale: 'c'};
  }

  // 定义两个回调函数用于处理数据变化, 并更新到state
  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    // 定义两个数据
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

### 流程回顾

最后再来回顾一下, 从你在input框中输入数字之后, 这些组件到底做了些什么:

* React 会调用 `DOM` 中 `<input>` 的 `onChange` 方法。在本例中，它是 `TemperatureInput` 组件的 `handleChange` 方法。

* `TemperatureInput` 组件中的 `handleChange` 方法会调用 `this.props.onTemperatureChange()`，并传入新输入的值作为参数。其 `props` 诸如 `onTemperatureChange` 之类，均由父组件 `Calculator` 提供。

* 起初渲染时，用于摄氏度输入的子组件 `TemperatureInput` 中的 `onTemperatureChange` 方法与 `Calculator` 组件中的 `handleCelsiusChange` 方法相同，而，用于华氏度输入的子组件 `TemperatureInput` 中的 `onTemperatureChange` 方法与 `Calculator` 组件中的 `handleFahrenheitChange` 方法相同。因此，无论哪个输入框被编辑都会调用 `Calculator` 组件中对应的方法。

* 在这些方法内部，`Calculator` 组件通过使用新的输入值与当前输入框对应的温度计量单位来调用 `this.setState()` 进而请求 React 重新渲染自己本身。

* React 调用 `Calculator` 组件的 `render` 方法得到组件的 UI 呈现。温度转换在这时进行，两个输入框中的数值通过当前输入温度和其计量单位来重新计算获得。

* React 使用 `Calculator` 组件提供的新 `props` 分别调用两个
`TemperatureInput` 子组件的 `render` 方法来获取子组件的 UI 呈现。

* React 调用 `BoilingVerdict` 组件的 `render` 方法，并将摄氏温度值以组件 `props` 方式传入。

* React DOM 根据输入值匹配水是否沸腾，并将结果更新至 DOM。我们刚刚编辑的输入框接收其当前值，另一个输入框内容更新为转换后的温度值。


## 组合与继承

通常有的吴总监无法提前预知其子组件的具体内容。例如在 `Sidebar` 和 `Dialog` 等展现通用容器(box)的组件中特别容易遇到这种情况。

这里可以使用一个特殊的prop : `children` 来指代这些未知的内容。

```jsx {4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

现在再其他地方使用 `FancyBorder` 这个组件时, 可以在其内部嵌套任意其他组件, 这些组件都直接作为 `FancyBorder` 的子组件。

```jsx {4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting!
      </p>
    </FancyBorder>
  );
}
```