# JavaScript

## 基础

### call()、apply()、bind()

先看简单的例子:

* 例子1
```JavaScript
var name = '赵', rank = 1
var newGuy = {
  name: '钱',
  hisRank: this,
  func: function () {
    console.log(`${this.name}的排名是${this.rank}`)
  }
}
```

输出结果:

```JavaScript
newGuy.hisRank;  // 1
newGuy.func()  // 钱的排名是undefined
```

* 例子2
```JavaScript
var name = '孙'
function newFunc() {
  console.log(this.name)
}
```

输出结果:

```JavaScript
newFunc()  // 孙
```

比较一下两个例子中的 `this` 指向:
* 例子1 的 `console` 中 `this` 指向: `newGuy`
* 例子2 的 `console` 中 `this` 指向: `window`(没有上下文, 默认window)

**call()、apply()、bind() 都是用来重定义 `this` 的指向**

现在延展一下例子1:

```JavaScript
var name = '赵', rank = 1
var newGuy = {
  name: '钱',
  hisRank: this,
  func: function () {
    console.log(`${this.name}的排名是${this.rank}`)
  }
}
var another = {
  name: '李',
  rank: 4
}
```
输出结果:

```JavaScript
newGuy.func.call(db);    // 钱的排名是4
newGuy.func.apply(db);   // 钱的排名是4
newGuy.func.bind(db)();  // 钱的排名是4
```
**bind()方法返回的是函数, 需要调用才会被执行**

### 闭包

闭包的定义:

**当在函数内部定义了其他函数时候，就创建了闭包。闭包有权访问包含函数内部的所有变量。**

在通常情況下, 一个函数被执行结束后, 函数本身和其自身的内部变量都将会被从内存中释放, 所以外部无法访问

一段简单的代码:
```JavaScript
function myFunc(newName) { 
  var name="ZooMze"
  return (newName) => {
    console.log(name, newName)
  }
} 

myFunc()('new') // ZooMze new
```

以上代码就形成了一个典型的闭包，函数 `myFunc()` 执行之后，在它内部声明的变量 `name` 依然可以使用。

闭包描述了函数执行完毕内存释放后，**依然内存驻留** 的一个现象。

### ES6
* 类
* 模块化
* 箭头函数
* 函数参数默认值
* 模板字符串
* 解构赋值
* 延展操作符
* 对象属性简写
* Promise
* Let与Const

#### 类（class）
对熟悉Java，object-c，c#等纯面向对象语言的开发者来说，都会对class有一种特殊的情怀。ES6 引入了class（类），让JavaScript的面向对象编程变得更加简单和易于理解。
```JavaScript
  class Animal {
    // 构造函数，实例化的时候将会被调用，如果不指定，那么会有一个不带参数的默认构造函数.
    constructor(name,color) {
      this.name = name;
      this.color = color;
    }
    // toString 是原型对象上的属性
    toString() {
      console.log('name:' + this.name + ',color:' + this.color);

    }
  }

  var animal = new Animal('dog','white');//实例化Animal
  animal.toString();

  console.log(animal.hasOwnProperty('name')); //true
  console.log(animal.hasOwnProperty('toString')); // false
  console.log(animal.__proto__.hasOwnProperty('toString')); // true

  class Cat extends Animal {
    constructor(action) {
      // 子类必须要在constructor中指定super 函数，否则在新建实例的时候会报错.
      // 如果没有置顶consructor,默认带super函数的constructor将会被添加、
      super('cat','white');
      this.action = action;
    }
    toString() {
      console.log(super.toString());
    }
  }

  var cat = new Cat('catch')
  cat.toString();

  // 实例cat 是 Cat 和 Animal 的实例，和Es5完全一致。
  console.log(cat instanceof Cat); // true
  console.log(cat instanceof Animal); // true
```
#### 模块化(Module)
#### 箭头函数（Arrow）

### ES7

### ES8

### ES9

### ES10

### ES11