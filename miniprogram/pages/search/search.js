const app = getApp();
wx.cloud.init()
Page({
  key: '',
  data: {
    inputValue: '',
    hotKeyList: ['钢铁侠','复仇者联盟','这个杀手不太冷','调音师','老师好'],
    historyKeyList: []
  },

  //页面一加载，就把历史信息放在页面上
  onLoad: function (options) {
    const self=this
    const historyKeyList = app.globalData.userMovieInfo.historyKey
    self.setData({
      historyKeyList: historyKeyList
    })
  },

  //页面一显示就更新搜索框为空
  onShow: function () {
    this.setData({
      inputValue: ''
    })
  },

  setKey(e) {
    this.key = e.detail.value
    console.log(this.key)
  },

  searchByKey(e) {
    const self = this
    //判断是否是热门搜索和历史搜索触发的，如是，把值渲染到输入框
    if (e.currentTarget.dataset.key) {
      self.key = e.currentTarget.dataset.key
      self.setData(
        { inputValue: self.key }
      )
    }
    //判断搜索关键字是否与历史搜索重复
    //若重复，就将改关键字提升到历史搜索的第一位
    let historyKeyList = self.data.historyKeyList
    // filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。 
    historyKeyList=historyKeyList.filter(el=>{
      if(el!==self.key) return el
    })

    //判断搜索历史长度是否超过指定长度，如是，就删除最后一个关键字
    if(self.data.historyKeyList.length===10){
      historyKeyList.pop()
    }

    //将关键字添加到历史数组前面
    historyKeyList.unshift(self.key)
    setTimeout(() => {
      self.setData({
        historyKeyList:historyKeyList
      })
    }, 1000)
    app.globalData.userMovieInfo.historyKey=historyKeyList
    wx.navigateTo({
      url: '../searchResult/searchResult?key='+self.key
    })

  }
})