const app= getApp();
console.log(app)
Page({
  data:{
    userInfo:{}
  },
  onLoad(options){
    const userInfo = app.globalData.userInfo
    console.log(app.globalData.userInfo)
    let gender=userInfo.gender
    
    if(gender===1){
      gender='男'
    }else if(gender===2){
      gender='女'
    }else{
      gender='未知'
    }
    app.globalData.userInfo.gender=gender
    if(userInfo){
      this.setData({
        userInfo:userInfo
      })
    }
  }
})