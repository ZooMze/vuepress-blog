---
title: 获取和设置本机的SSH keys
date: 2020-07-01
categories:
 - 教程
 - 备忘
tags:
 - others
---

## 前言

为什么GitHub需要SSH Key呢？

因为GitHub需要识别出你推送的提交确实是你推送的，而不是别人冒充的，而Git支持SSH协议，所以，GitHub只要知道了你的公钥，就可以确认只有你自己才能推送。

当然，GitHub允许你添加多个Key。假定你有若干电脑，你一会儿在公司提交，一会儿在家里提交，只要把每台电脑的Key都添加到GitHub，就可以在每台电脑上往GitHub推送了。

那么开始配置SSH吧~

## 1.检查是否存在SSH

首先检查有没有在GitHub的 [https://github.com/settings/keys](https://github.com/settings/keys) 上添加你本机的SSH key。

![查看GitHub SSH Keys](./../../.vuepress/public/images/settingSSH/sshKeys.png)

在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有id_rsa和id_rsa.pub这两个文件，如果已经有了，可直接跳
。
![查看本地秘钥](./../../.vuepress/public/images/settingSSH/sshLocation.png)

如果没有, 则开始第2步, 创建SSH Key

## 2.创建 SSH Key

打开Shell（Windows下打开Git Bash），运行以下命令

`$ ssh-keygen -t rsa -C "youremail@example.com"`

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可。

执行完毕后, 在提示的目录或者本文开头图片中的地址找到相应的的文件 id_rsa 和 id_rsa.puh (这个就是公钥, 下一步我们将使用它)

## 3.配置 SSH Key

进入GitHub的个人设置页, 进入 SSH and GPG keys 选项卡

点击右侧的 **New SSH key** 添加按钮, 将id_rsa.pub 内的内容粘贴进输入框点击保存即可

![进入配置](./../../.vuepress/public/images/settingSSH/sshKeysSettings.png)

## 其他问题

### Git Bash 的问题

如果添加了还是出现这个问题，那么问题大概率就定位在了你本机的这个git仓库并没有和这个SSH key 关联上。用下述方法解决:

`$ ssh-add 你的id_rsa文件地址`

注意这里ssh-add后面填的是私钥id_rsa的地址，例如 C:/用户/Admin/.ssh/id_rsa

如果add这一步失败的话， 运行如下命令：

`$ ssh-agent -s`

之后再次add，如果仍然报错:

`Could not open a connection to your authentication agent.`

那么再运行如下命令：

`$ ssh-agent bash`

然后再再次add, 成功之后出现:

`Identity added: /c/Users/Admin/.ssh/id_rsa (你的邮箱地址)`

验证是不是添加成功的命令:

`$ ssh -T git@github.com`

看到这句话就OK咯:

`Hi 你的用户名! You've successfully authenticated, but GitHub does not provide shell access.`

### TortoiseGit 的问题

按照上述方法配置完之后你会发现, TortoiseGit还是用不了, 这是为啥捏? 因为TortoiseGit默认是PuTTY密钥, 如果安装时一路下一步下一步, 那么公钥是对不上滴, 那么需要再来重新来他配置OpenSSH

进入TortoiseGit / 设置 / 常规设置 / 重新运行首次启动向导

![TortoiseGit](./../../.vuepress/public/images/settingSSH/sshTortoiseGit.png)

配置完成后, 跟Git Bash配置好的SSH公钥可以一起使用, 两者互不干扰

参考资料:
[https://blog.csdn.net/dotphoenix/article/details/100130424](https://blog.csdn.net/dotphoenix/article/details/100130424)

[https://blog.csdn.net/qq_19393857/article/details/81629431](https://blog.csdn.net/qq_19393857/article/details/81629431)

[https://www.jianshu.com/p/7d57ce4147d3](https://www.jianshu.com/p/7d57ce4147d3)