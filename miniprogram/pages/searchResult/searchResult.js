const fetch=require('../../common/script/fetch')
Page({
  key:'',
  data:{
    movieList:[],
    showLoading:true,
    hasMore:true,
    movieSkinIndex:0
  },
  onLoad(query){
    // console.log(query)
    const self=this
    self.key=query.key
    const args = ['movieHot',self.data.movieSkinIndex ,self.key ,self.handleResData]
    fetch.fetchSearchResult.apply(self,args)
  },
  handleResData(data) {
    //  console.log("handleResData")
      const self = this
      let movieData = data
  
      movieData.forEach(element => {
        // 播放时长转换
        let duration = element.duration
        let minutes = Math.floor(duration / 60)
        minutes = minutes < 10 ? '0' + minutes : minutes
        let seconds = parseInt(duration % 60)
        seconds = seconds < 10 ? '0' + seconds : seconds
  
        let durationDesc = minutes + ':' + seconds
        element.duration = durationDesc
  
        // 预告片类型转换
        element.type = element.type.substring(0, 2)
      })
      self.setData({
        movieList: self.data.movieList.concat(movieData)
      })
    },
  goDetail(e){
    console.log(e)
    const id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id='+id
    });
  }
})

