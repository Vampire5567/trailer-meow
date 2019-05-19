const fetch = require('../../common/script/fetch.js')
const app = getApp()
Page({
  recommendRawList:[],
  data:{
    showLoading:true,
    hasMore:true,
    recommendList:[],
    movieSkinIndex:0
  },
  onLoad(){
    //因为云函数后台已经在我们每次浏览预告片的时候，根据算法写出recommendList并上传到数据库，所以我们只要在这里根据openid搜索从云端获取数据就行
    const self=this
    const openid=app.globalData.openid
    const reqMaxCount = 5  //一次加载预告片最大数量
    const userCo = wx.cloud.database().collection('user')
    userCo.where({
      _openid:openid
    }).get()
    .then(res=>{
      console.log(res.data)
      self.recommendRawList=res.data[0].recommendList
      self.recommendRawList.forEach(element => {

        // 播放时长表示修饰 
        let duration = element.duration
  
        let minute = Math.floor(duration / 60)
        minute = minute < 10 ? "0" + minute : minute
        let second = parseInt(duration % 60)
        second = second < 10 ? "0" + second : second
        let durationDec = minute + ":" + second
        element.duration = durationDec
        //  预告片类型调整 
        element.type = element.type.substring(0, 2)
      })

      self.setData({
        recommendList:self.data.recommendList.concat(self.recommendRawList.slice(self.data.movieSkinIndex,self.data.movieSkinIndex+reqMaxCount)),
        showLoading:false,
        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
      })
    })
  },
  onReachBottom(){
    const self = this
    const reqMaxCount = 5  //一次加载预告片最大数量
    self.setData({
      recommendList: self.data.recommendList.concat(self.recommendRawList.slice(self.data.movieSkinIndex,self.data.movieSkinIndex + reqMaxCount)),
      movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
    })
    if(self.data.movieSkinIndex===self.recommendRawList.length){
      self.setData({
        hasMore:false
      })
    }
  },
  goDetail(e){
    console.log(e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
     url: '../detail/detail?id='+id
   })
  },
  onPullDownRefresh(){
    const self=this

    self.setData({
      showLoading:true,
      hasMore:true,
      recommendList:[],
      movieSkinIndex:0
    })
    setTimeout(()=>{
      app.updataSortArr(app)
      self.onLoad()
    },500)
  }
})