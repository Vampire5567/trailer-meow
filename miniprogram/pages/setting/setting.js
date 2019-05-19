const app= getApp();

Page({
  data: {
  },
  goPersonInfo(){
    wx.navigateTo({
      url: '../personInfo/personInfo'
    })
  },
  goAbout(){
    wx.navigateTo({
      url: '../about/about'
    })
  },
  clearStorage(){
    wx.showModal({
      title: '确认要清除',
      content: '清除缓存会删除浏览历史和收藏及个人资料',
      success: (result) => {
        if(result.confirm){
          app.globalData.userMovieInfo={
            collectionList:[],
            historyList:[],
            historyKey:[],
            set:{
              name:'',
              nickName:'',
              gender:'',
              age:'',
              birthday:''
            },
            avatarBgUrl:'../../common/images/avatar-bg2.jpg'
          }
          wx.showToast({
            title: '清除成功',
            icon: 'success',
            duration: 2000
          })
        }
      }

    })
  }
  
})
