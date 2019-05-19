const fetch=require('../../common/script/fetch')
Page({
  type:'',
  data:{
    movieList:[],
    showLoading:true,
    hasMore:true,
    movieSkinIndex:0
  },
  onLoad(query){
    const self=this
    self.type=query.type
    const args=['movieHot',self.data.movieSkinIndex,self.type,self.handleResData]
    fetch.fetchTypeList.apply(self,args)
  },
  onReachBottom(){
    const self = this
    var args = [ 'movieHot',self.data.movieSkinIndex,self.type,self.handleResData ]
    fetch.fetchTypeList.apply(self,args)
  },
  handleResData(data) {
    const self = this

    const movieData = data

    movieData.forEach(element => {

      // 播放时长表示修饰

      let duration = element.duration

      let minute = Math.floor(duration / 60)
      minute = minute < 10 ? "0" + minute : minute
      let second = parseInt(duration % 60)
      second = second < 10 ? "0" + second : second
      let durationDec = minute + ":" + second
      element.duration = durationDec

      // 预告片类型调整

      element.type = self.type
    })
    self.setData({
      movieList: self.data.movieList.concat(movieData)
    })
  },
  goDetail(e){
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type 
    wx.navigateTo({
     url: '../detail/detail?id='+id+'&type='+type 
   })
 }
})