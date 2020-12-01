<!-- ---
title: 最强布局兄弟 Grid & Flex
date: 2020-08-31
categories:
 - 基础
tags:
 - CSS3
 - 备忘
--- -->

本文按时间线来介绍, 先介绍推出较早的Flex, 然后是更强的Grid

## Flex

Felx布局全称为 "Flexible Box" (弹性布局), 它由W3C于2009年提出的一种一维的轴线布局, 对其内部的items进行在轴线上的排列布局, 现在它已经被广泛支持(IE 永远滴神...)

### 基本概念

任意一个元素都可以被指定为Flex容器(后文都将容器称之为container), 在container内的元素自动成为其成员(后文都将成员称为item)

container拥有两个轴线: 主轴(`amin axis`) 和 交叉轴(`cross axis`); 通常情况下主轴是横向的, 当然也可以通过属性进行改变, 主轴的起点称为(`main start`), 终点称为(`main end`), 交叉轴也有这两个端点

然后是item内的长度描述, item在主轴上占据的空间称为`main size`

::: warning 注意
item的 `float`, `clear`, `vertical-align` 属性都将失效
:::

## Grid
