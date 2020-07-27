---
title: WebRTC 入门
date: 2020-07-24
categories:
 - 基础
 - 教程
tags:
 - WebRTC
 - 网络知识
---

## 简介

以下内容引自百度百科:

_WebRTC，名称源自 **网页即时通信**（英语：Web Real-Time Communication）的缩写，是一个支持网页浏览器进行实时语音对话或视频对话的API。它于2011年6月1日开源并在Google、Mozilla、Opera支持下被纳入万维网联盟的W3C推荐标准。_

WebRTC的出现为了让开发者能给更加容易地开发出基于浏览器的实时多媒体应用, 无需安装和下载任何插件, 让开发者真正只专注于开发避免重复地进行复杂的配置

WebRTC提供了视频会议的核心技术，包括音视频的采集、编解码、网络传输、显示等功能，并且还**支持跨平台**：Windows，Linux，Mac，Android

## 基本使用

### 概述

如果你了解过WebSocket, 那么这个连接过程其实是类似的, 他们都需要通过一个协议来建立一个持久连接, 在连接结束前, 这两端才可以进行实时通信

::: tip 关于WebSocket协议
WebSocket协议并非一个独立的协议, 这个协议也位于应用层上, 事实上它是基于HTTP协议的, 需要在HTTP报文头部指定头部来升级为WebSocket协议的连接

```js
Connection: Upgrade
Upgrade: WebSocket
```

也就是说, 建立WebSocket协议时, 先创建的是HTTP协议, 然后再升级。当然 API 内已经做好了这些事情, 仅仅只需要了解即可
:::

他们的 API 设计风格都非常类似, 但不同于 WebSocket 的是, WebRTC 需要知道通信对方的电脑软硬件信息, 来确保通信的可行和稳定。

