const fetch = require('../../common/script/fetch.js')

Page({
  data: {
    showLoading:true,
    movieSkinIndex: 0,//电影的序列号
    movieList: [
      // {
      //   _id: "5cd2cc5461b6fe467fe5558e",
      //   duration: "02:34",
      //   name: "这个杀手不太冷",
      //   type: "动作",
      //   poster: "http://pr0d5m3ud.bkt.clouddn.com/DRjndJHTpvEiTmWUZShT2.jpg"
      // }
    ],//电影列表
    hasMore: true,//是否还有更多
    banners: [//轮播图
      {
        title: "我不是药神",
        type: "喜剧",
        decoration: "|",
        duration: "01:30"
      },
      {
        title: "复仇者联盟3：无限战争 ",
        type: "动作",
        decoration: "|",
        duration: "02:19"
      },
      {
        title: "钢铁侠 Iron Man",
        type: "科幻",
        decoration: "|",
        duration: "02:29"
      }
    ]
  },

  // Function.apply(obj,args)方法能接收两个参数
  // obj：这个对象将代替Function类里this对象
  // args：这个是数组，它将作为参数传给Function（args-->arguments）

  //页面初始化，获取电影列表，渲染推荐页面
  onLoad: function (options) {
    const self = this
    var args = ['movieHot', self.data.movieSkinIndex, self.handleResData]
    fetch.fetchMovieList.apply(self, args)
  },

  //页面下拉触底事件的处理函数
  onReachBottom: function () {
    const self = this
    var args = ['movieHot', self.data.movieSkinIndex, self.handleResData]
    fetch.fetchMovieList.apply(self, args)
  },

  // 点击搜索框，进入搜索页面
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  //在组件中可以定义数据，这些数据将会通过事件传递给 SERVICE。 书写方式： 以data-开头，多个单词由连字符-链接，不能有大写(大写会自动转成小写)如data-element-type，最终在 event.currentTarget.dataset 中会将连字符转成驼峰elementType。
  //点击电影，跳转详情页面
  goDetail: function (e) {
    // console.log(e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      //获取前台页面用data-id通过点击事件传过来的值
      url: '../detail/detail?id=' + id
    })
  },

  //handleResData对从数据库取得电影预告数据进行处理，是个被委托的函数
  // data是个电影资料数组，数组里面是多个电影对象
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
  }


})
