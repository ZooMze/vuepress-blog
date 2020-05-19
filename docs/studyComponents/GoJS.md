# GOJS 中文学习文档

__by ZooMze__
__LastEditTime: 2020-04-17__

依赖HTML5 需要在页面中声明
开发模式使用 `go-debug.js` 部署模式使用 `go.js`

## 开始

从CDN 引入:
`<script src="https://unpkg.com/gojs/release/go-debug.js"></script>`

指定元素一个`<div>`:
`<div id="myDiagramDiv" style="width:400px; height:150px; background-color: #DAE4E4;"></div>`
元素需要给出明确的宽高, 否则将无法进行渲染

从npm安装 
`npm install gojs`
引入
`import go from 'gojs'`

传递元素id, 渲染图形
```JavaScript
var $ = go.GraphObject.make;
var myDiagram =
  $(go.Diagram, "myDiagramDiv");
```
注意`go`是GOJS的预留的命名空间, GoJS类的所有代码都在`go.`之中。

使用`$`作为`go.GraphObject.make`的缩写, 如果使用其他的库例如jQuery, 请使用别的内容代替`$`, 本文将详细介绍如上内容

__在本文当中 `$`默认指定为`go.GraphObject.make()`函数__

## 核心概念
GOJS 中任何内容都可以认定为GraphObject的继承

### 图形类别层级 Hierarchy
GraphObject
* Panel
  * Part
    * Adornment
    * Node
      * Group
    * Link
      * BalloonLink
      * DimensioningLink
      * FishboneLink
      * ParallelRouteLink
* Shape
* TextBlock
* Picture
* Placeholder

### 视图 Diagram
GoJS一切内容的载体 所有内容都需要Diagram作为基本容器

`Diagram` 需要与一个实际存在的DIV关联 所有内容将以此DIV作为画板

`Diagram` 将自动根据Model中的内容进行图形渲染, 其拥有一系列模板: ` nodeTemplateMap`, `groupTemplateMap`, 和 `linkTemplateMap.` 通过这些模板可以修改全局的构造属性以及其属性值(通过`Binding()`)

*对于已渲染的的`Diagram`, 仍可以再次修改其内容, 参照下文的`Model`相关内容

### 数据模型 Model
用以描述模视图的状态内容的, 涵盖了基础配置以及数据模型
`Model`只描述数据(data), 不包含任何`GraphObject`的实例, model有两种类型: `GraphLinksModel` 和 `TreeModel`
* GraphLinksModel 描述了节点(node)和节点关系(link)
```JavaScript
 model.nodeDataArray = [
   { key: "Alpha" },
   { key: "Beta" }
 ];
 model.linkDataArray = [
   { from: "Alpha", to: "Beta" }
 ];
```
* TreeModel 描述了具有属性结构的数据
```JavaScript
  model.nodeDataArray = [
    { key: "Alpha" },
    { key: "Beta", parent: "Alpha" },
    { key: "Gamma", parent: "Alpha" }
  ];
```
每一个图形data都应包含一个唯一的key属性, 这个属性名默认为'key', 并且不应给这个属性指定双向绑定的Binding; 如果key值未定义`undefined`, GOJS会尝试自动创建一个唯一属性

model 并不会动态的检测任何数据源的变化 但可以调用 `addNodeData()`、 `removeNodeData()`等

如果是需要修改构造类属性, 则可以调用` setKeyForNodeData()`, `setCategoryForNodeData()`, `GraphLinksModel.setToKeyForLinkData()`, `GraphLinksModel.setGroupKeyForNodeData()`

## 开始绘制

### 绘图 GraphObject.make()
make函数非常常用, 可以创造所有的GraphObject, 并且可以如同树一样嵌套定义, 简化了平面的声明式代码

make函数的其他参数有如下类型
* GraphObject对象, 通常是第一个参数, go.Model、go.Panel等; 用于添加到当前make正在构造的对象中(GraphObject的多重嵌套)
* 键值对对象, 为当前make构造对象中可定义的属性名和值(不要注册其不支持的属性)
* GoJS的内置的常量, 如Point, Margin, 用于快速指定当前构造的object的唯一属性值
* 字符串, 例如textBlock的文本, figure指定内置或自定义形状, picture的URL 或者Panel.type的类型
* RowColumnDefinition, 用于描述在table Panles中的状态
* 更多内容请查看官方文档... [点击](https://gojs.net/latest/intro/buildingObjects.html#BuildingWithMake)

Panel.type 有如下类型
* Panel.Position(默认值) 
* Panel.Vertical
* Panel.Horizontal
* Panel.Auto
* Panel.Spot
* Panel.Table
* Panel.Viewbox
* Panel.Link (see also Links, which are all Panels of type Link)
* Panel.TableRow
* Panel.TableColumn
* Panel.Grid
* Panel.Graduated

由于使用`GraphObject.make`进行的所有这些初始化仍然是JavaScript代码，因此make函数可以再进一步嵌套,
```JavaScript
  // 定义笔刷
  var violetbrush = $(go.Brush, "Linear", { 0.0: "Violet", 1.0: "Lavender" });
  // 添加节点
  diagram.add(
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle",
        { fill: violetbrush }),
      $(go.TextBlock, "Hello!",
        { margin: 5 })
    )
  );

  diagram.add(
    $(go.Node, "Auto",
      $(go.Shape, "Ellipse",
        { fill: violetbrush }),
      $(go.TextBlock, "Goodbye!",
        { margin: 5 })
    )
  );
```

### 数据绑定 binding
`go.Binding('*propertyName*', '*valueKey*' function(value) { return v + 'something...' })`
eg: 
`new go.Binding("location", "loc", go.Point.parse),  // convert string into a Point value`
nodeData中有名为'loc'的值, 且使用转换函数进行数据转化为`Point`类型
Binding 用于指定关联的值 默认是单向绑定 
内置方法: 
* `.makeTwoWay()` 进行双向绑定
* `.ofModel()`    声明数据来源于model中 即Model.modelData
* `.ofObject()`   声明数据来源是GraphObject中, 第二个参数将发生变化, 意指当前GraphObject的属性, 若为空则是修改整个Objet

```JavaScript
// 次数也使用了nodeTemplate, 用于定义全局的模板linkTemplate同理
diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape,
        { figure: "RoundedRectangle",
          fill: "white" },  // 次数可以定义, 如果有Binding函数则将被覆盖
        new go.Binding("fill", "color")),  // 使用数据源的nodedata.color来指定fill属性的值
      $(go.TextBlock,
        { margin: 5 },
        new go.Binding("text", "key"))  // 使用数据源的nodedata.key来指定TextBlock.text属性的值
    );

  var nodeDataArray = [
    { key: "Alpha", color: "lightblue" },
    { key: "Beta", color: "pink" }
  ];
  var linkDataArray = [
    { from: "Alpha", to: "Beta" }
  ];
  diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray); // 直接全部覆盖修改节点和连线数据
```

### 更新视图 Changing
通常在图标创建完成后 仍需要作出一些改动 例如修改对应关系 增删节点等
#### 常用方法 Usual

```JavaScript
  //节点常用
  Model.setCategoryForNodeData() // 修改node的类型
  Model.setKeyForNodeData() // 指定node的key值在model中的对应
  GraphLinksModel.setGroupKeyForNodeData() // 指定nodeGroup的key值在model中的对应

  //连线常用
  GraphLinksModel.setCategoryForLinkData()
  GraphLinksModel.setFromKeyForLinkData()
  GraphLinksModel.setFromPortIdForLinkData()
  GraphLinksModel.setToKeyForLinkData()
  GraphLinksModel.setToPortIdForLinkData()
  GraphLinksModel.setLabelKeysForLinkData()
```