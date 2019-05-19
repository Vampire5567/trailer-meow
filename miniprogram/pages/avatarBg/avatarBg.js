const app=getApp();

Page({
  data:{
    bgList:[
      {
        src:"../../common/images/avatar-bg1.jpg",
        title:"公路"
      },
      {
        src:"../../common/images/avatar-bg2.jpg",
        title:"黑夜森林"
      },
      {
        src:"../../common/images/avatar-bg3.jpg",
        title:"鱼与水"
      },
      {
        src:"../../common/images/avatar-bg4.jpg",
        title:"山之剪影"
      },
      {
        src:"../../common/images/avatar-bg5.jpg",
        title:"火山"
      },
      {
        src:"../../common/images/avatar-bg6.jpg",
        title:"科技"
      },
      {
        src:"../../common/images/avatar-bg7.jpg",
        title:"沙漠"
      },
      {
        src:"../../common/images/avatar-bg8.jpg",
        title:"叶子"
      },
    ]
  },
  choseBg(e){
    const src=e.currentTarget.dataset.src
    console.log(app.globalData)
    app.globalData.userMovieInfo.avatarBgUrl=src
    wx.navigateBack({
      delta: 1
    })
  }
})