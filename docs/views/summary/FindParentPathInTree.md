---
title: 在树形数据中查找节点的Parent Path
date: 2020-06-30
categories:
 - 备忘
tags:
 - JavaScript
---

## 需求是什么

我们先来看看源数据长啥样:

```js {12}
const treeData = {
  name: '某某公司',
  id: '1',
  children: [
    {
      name: '直属部门1',
      id: '2',
      children: [
        {
          name: '分部门1',
          id: '4',
          // children: [], 没有子集时children字段可以为空 或者 直接不存在这一字段
        }
      ]
    },
    {
      name: '直属部门2',
      id: '3',
      children: [
        {
          name: '分部门2',
          id: '5',
          children: [
            {
              name: '小组1',
              id: '7'
            },
            {
              name: '小组2',
              id: '8'
            }
          ]
        },
        {
          name: '分部门3',
          id: '6'
        }
      ]
    }
  ]
}
```

代码看起来可能不是很好直观, 可视化一下是这样的:

* 某某公司
  * 直属部门1
    * 分部门1
  * 直属部门2
    * 分部门2
      * 小组1
      * 小组2
    * 分部门3

它有这些特点:

* 子集中的数据不包含 `parentId`, 也就是父节点的**id**, 某些时候也许会有
* 是一个很标准的树, 有根节点, 并由 `children` 字段体现层级关系, 表示其子集数组
* 每个节点都有且必须要有一个唯一的 `id`, 这表明了每一个节点在本树中都是独一无二的

需求来了: _在树形数据中, 选取任意一个节点, 例如 **小组1**, 将这个节点的信息存储并显示到别的位置, 后期将使用这个节点的id, 但是显示的时候并不是节点的名称, 而是显示这个节点到根节点的路径( **'某某公司 / 直属部门 2 / 分部门 2 / 小组 1'** )_。

看起来很简单的功能却有不大不小的痛点, 服务端绝大多数情况下是不会也不希望存储这个路径信息的 :( , 意味着需要我们自己来获取并显示。

## 最初的思路

对于树形数据, 在其中寻找内容时, 第一个想法就是借助递归, 由于树的层级是未知的, 通常的循环无法很好地胜任, 递归可以已最简洁的代码遍历完整棵树, 我们先来写一个简单的递归像是这样:

```js {6}
function recursion (node) {
  if(!node) {
    return false
  }

  console.log(node.name) // 输出每一项的名称

  if(node.children && node.children.length > 0) {
    node.children.forEach(node => {
      recursion(node)
    })
  } else {
    return false
  }
}
```

控制台输出结果:

```js
'某某公司'
'直属部门1'
'分部门1'
'直属部门2'
'分部门2'
'小组1'
'小组2'
'分部门3'
```

上面这种递归看起来挺好的, 但是通常一个递归会**完整地遍历一整棵树**, 然后我们所做的事(_写的功能代码_)只不过是在整个过程中的附赠品, 它会遍历至最后一个叶子节点, 无论你是否在这个最后的节点有事可做。

::: warning 注意
**递归只适用于拥有根节点的`treeData`!**
如果 `treeData` 没有根节点, 即以数组为第一层级的数据: [node, node..., node], 则需要你手动将其处理为 `children` 并包含在一个新的根节点中。
:::

## 实现功能

刚刚我们仅仅实现了最简单的递归, 离完成需求还差点距离, 毕竟只是遍历了树, 我们还没记录路径 **parentPath** 呢!

现在思考如何在一次完整的递归中, 获取并按顺序显示**小组1**的路径:

观察刚刚的输出结果, 会发现一个规律: 节点的遍历是'一直到头'的, 即遍历完一个完整的单线分支后, 再继续遍历其余的分支, 根据这个特征, 我们可以用遍历中途打断的方式来完成我们的需求。

我们先定义一个局部变量 `tempPath` 用来记录, 并让遍历进行下去, 然后一边遍历, 一边向 `tempPath` 中 `push` 当前遍历的节点名称 `name`, 如果遍历到了最末端的节点仍未成功找到, 则删除当前遍历的这一层级, 每一层级都这么做, 直到最终找到了匹配的节点, 终止递归, 当前已经保存好的 `tempPath` 就是需要的路径。

描述着可能有点绕, 上代码, 边看边理解:

```js {16-18,34,37}
/*
 * 根据所需nodeId和数据treeData, 获取路径
 * nodeId 节点Id
 * treeData 标准树数据Data
 * callback 回调函数
 */
function getPathById(nodeId, treeData, callback) {
  let tempPath = [] // 路径数组

  try {
    // 定义方法 方法也可以定义在外部
    function getNodePath(node) {
      tempPath.push(node.name); // 每个节点调用方法时, 先添加至tempPath中

      // 先判断当前节点是否就是目标节点, 如果找到了, 则抛出异常终止递归
      if (node.id == nodeId) {
        throw ("节点已找到!");
      }

      // 接下来是 **没有** 匹配到的情况, 则会继续向下层子节点遍历
      if (node.children && node.children.length > 0) { // 这里判断一下字段是否存在, 避免异常
        // * 找到非叶子节点, 遍历所有子节点
        node.children.forEach(child => {
          getNodePath(child);
        })
        // 当前节点的所有子节点遍历完, 删除路径中的该节点
        tempPath.pop();
      } else {
        // * 找到叶子节点时, 删除路径当中的该叶子节点
        tempPath.pop();
      }
    }

    getNodePath(treeData); // 开始递归
  } catch (e) {
    const result = tempPath.join(" / ");
    callback(result); // 返回结果
  }
}
```

我们来运行一下上述代码:

```js
getPathById(5, treeData, result => {console.log(result)})
// 控制台输出 >> '某某公司 / 直属部门2 / 分部门2'
getPathById(7, treeData, result => {console.log(result)})
// 控制台输出 >> '某某公司 / 直属部门2 / 分部门2 / 小组1'
```

完成!

::: tip 提示

* 将方法定义为外部函数时, 注意在外部 `catch error`
* 自定义回调函数使数据返回更灵活
:::

## 总结

最后来总结下发生了些啥, 在递归中, 每一个节点都会调用一次 `getNodePath` 方法, 所以在递归时, 需要全局考虑到每一步都应该做些啥, 该用什么方式处理每一步的结果和过程。

换个比喻的方式, 刚刚的递归就像一个探路的蚂蚁一样, 从起点(根节点)出发, 遇到每一级的岔路便依次走完, 走一次就标记一次(`push()`), 遇到错误就删除并回到上一级(`pop()`), 当它找到目标时, 就停止侦查(`throw Error`), 带着已有的标记回到起点即可!
