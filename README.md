# 预告喵

这是一款基于小程序云开发的应用程序，用户可以浏览电影信息、观看预告片、小程序会根据算法给个人推荐不同的电影，用户可以收藏电影，在个人中心可以看到收藏的电影和历史记录。

## 项目介绍

分为4个主要模块，也就是4个tabbar

- 推荐（首页）：此页面分为搜索区域，轮播图，以及电影列表，点击电影会呈现对应的电影详细信息。
- 频道：此页面根据电影类型分为8类，分别为音乐、剧情、动画、科幻、喜剧、爱情、传记、惊悚，点击分别呈现响应类型的电影列表。
- 看点：根据个人的历史电影类型，根据类型权重给用户电影。
- 我的：个人中心，用户可以在此模块浏览历史记录、收藏的电影也在此模块呈现，用户也可以在此模块进行头像背景的更换、以及查看自己的相关信息、清除缓存等。

## UI

![index.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/index.png)
![detail.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/detail.png)
![search.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/search.png)
![channel.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/channel.png)
![recommend.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/recommend.png)
![my.png](https://github.com/Vampire5567/trailer-meow/raw/master/program-UI/my.png)






## 开发相关

### 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

### 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
