// miniprogram/pages/channel/channel.js
Page({
  data: {
    typeList:[
      
        {
          url: '../../common/images/music.jpg',
          type: "音乐"
        },
        {
          url: '../../common/images/story.jpg',
          type: "剧情"
        },{
          url:'../../common/images/cartoon.jpg',
          type:"动画"
        },{
          url:'../../common/images/fiction.jpg',
          type:"科幻"
        },{
          url:'../../common/images/comedy.jpg',
          type:"喜剧"
        },{
          url:'../../common/images/love.jpg',
          type:"爱情"
        },{
          url:'../../common/images/documentary.jpg',
          type:"传记"
        },{
          url:'../../common/images/panic.jpg',
          type:"惊悚"
        }
      
    ]
  },
  goChannelDetail(e){
    const type=e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../channelDetail/channelDetail?type='+type
    })
  }
})