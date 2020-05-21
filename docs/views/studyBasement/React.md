---
title: React(更新中)
date: 2020-05-21
categories:
 - 基础
tags:
 - React
desc: 本md文档使用了vuepress扩展, 移植时需要注意格式
---

# React
~~从入门到放弃~~
## 快速开始

### 通过标签引入
可以将下载好的react文件通过标签直接引入
`<script src="url"></script>`

### 工具链
React团队推荐的工具链

* 如果你是在学习 React 或创建一个新的单页应用，请使用 [Create React App](https://react.docschina.org/docs/create-a-new-react-app.html#create-react-app)。
* 如果你是在用 Node.js 构建服务端渲染的网站，试试 [Next.js](https://react.docschina.org/docs/create-a-new-react-app.html#nextjs)。
* 如果你是在构建面向内容的静态网站，试试 [Gatsby](https://react.docschina.org/docs/create-a-new-react-app.html#gatsby)。
* 如果你是在打造组件库或将 React 集成到现有代码仓库，尝试 [更灵活的工具链](https://react.docschina.org/docs/create-a-new-react-app.html#more-flexible-toolchains)。

### Create React App
本文推荐Create React App 此工具链, 从头开始搭建一个新的单页应用

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

```JavaScript
const element = <h1>Hello, world!</h1>;
```

JSX 既不是字符串也不是 HTML, 是一个 JavaScript 的语法扩展, JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。

```JavaScript
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
```JavaScript
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}</h1>;
  }
  return <h1>Hello, Stranger</h1>;
}
```

**Babel 会把 JSX 转译成一个名为 `React.createElement()` 函数调用。**
```JavaScript
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

```JavaScript
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


```JavaScript
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

### class组件(非受控组件)
最常见的组件, 类似Vue中的组件, 持有state状态管理, 继承了 `React.component` 。
此时在组件内 `this` 指向当前组件本身

```JavaScript
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
**

::: danger 警告
和VUE组件相同的是, props内的数据都不应去直接修改, 而是用state维护
:::

### function组件(受控组件)
不同于普通的组件, 虽然同样可以输出 `ReactDOM`, 但其没有自身的state, 仅能从父组件处获取 `props` 的值, 可以理解为被父组件控制, 即受控组件。

受控组件的具有 数据统一, 单向数据流, 直观等优点; 事实上, 可以尽量多的使用函数组件来代替class组件, 这可以极大的减少不必要的代码量和理解难度。

### 组合组件

组件可以在自身内部引用别的组件，也可以任意嵌套, 在JSX中可以直接使用想要的组件
```JavaScript
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

不修改入参的函数称为 **纯函数**, 所有React组件都不应该修改入参, 下一节将介绍state， 可以辅助完成被纯函数限制的内容

React 非常灵活, 但有一条严格的规则:
::: danger 警告
所有 React 组件都必须像纯函数一样保护它们的 props 不被更改
:::

## state & 生命周期

### state

在之前的计时器例子中, 通过反复调用 `tick()` 来重复渲染ReactDOM, 以达到视觉和数据更新的目的, 本章节将介绍state来代替这种笨重的写法。

State和props类似, state可完全自定义, 并且完全受控于当前组件。

先将之前的例子从函数组件变为class组件:
```JavaScript
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
```JavaScript
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

```JavaScript
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

``` JavaScript
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

`this.props` 和 `this.state` 可能会异步更新, 所以不要期望为同步调用

``` JavaScript
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

```JavaScript
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
```JavaScript
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

```JavaScript
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

```JavaScript
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

```JavaScript
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

```JavaScript
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

在这两种情况下，React 的事件对象 e 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。

## 条件渲染

由于机制的不同, React中的条件渲染是由 '`if`' 或者 '条件运算符' 来控制不同组件之间的渲染逻辑, 而并非Vue中的指令式条件渲染。

以下是一个控制 '登录/登出' 的功能组件, 并根据状态显示相应的组件(对应的操作按钮以及问候语)。

```JavaScript
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

```JavaScript
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
```JavaScript
true && expression  // true
false && expression // false
```

### 三目运算符 ? :

基于前面的 && 运算符逻辑, 你可能会立即联想到同样有条件判断特性的三目运算符:
以下是一个简单的代码片段
```JavaScript
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

```JavaScript
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

```JavaScript
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

```JavaScript
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

```JavaScript
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

### Key

`key` 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。

通常情况下一般使用数据源的唯一 "id", 保证数据不会变化的情况下可以使用索引 `index` 作为 `Key`, 但如果列表会发生顺序变化时, 会造成循环性能变差, 也可以查看这里[深入解析为什么 key 是必须的](https://react.docschina.org/docs/reconciliation.html#recursing-on-children)。

working...

