//app.js,app.js是项目的入口文件
App({
  // onLaunch 监听小程序初始化，初始化完成触发，全局只触发一次
  onLaunch: function () {
    const self = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    self.globalData = {}

    //先获取用户的授权设置，如果已经授权scope.userInfo，就获取用户的头像和昵称
    //wx.getSetting获取用户的当前设置
    wx.getSetting({
      success: res => {
        // authSetting用户授权结果,
        if (res.authSetting["scope.userInfo"]) {
          console.log("已授权！")
          //已经授权，可以直接调用wx.getUserInfo获取用户信息（头像昵称），但不会弹框。
          wx.getUserInfo({
            // 指定用户返回信息的语言为中文简体
            lang: 'zh_CN',
            success: res => {
              self.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })

    //请求云函数和数据库，获取openid
    // 若是新用户就创建新纪录。否则就获取用户相关信息
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      // console.log(res)
      self.globalData.openid = res.result.OPENID
    })
    // 根据openid向数据库查询是否存在此用户
    const userCo = wx.cloud.database().collection('user')
    userCo.where({
      openId: self.globalData.openid
    }).get()
      .then(res => {
        //因为已经指定了openid，所以这个用户要么就是唯一一个，要么就是还没创建
console.log(res)
        // _id和_openid这些内容放在res.data中
        if (res.data.length === 1) {
          //将用户数据保存在小程序全局变量之中
          self.globalData.userId = res.data[0]._id
          //为什么用户数据的id和openid要删掉
          delete res.data[0]._id
          delete res.data[0]._openid
          self.globalData.userMovieInfo = res.data[0]
        } else {
          userCo.add({
            data: {
              collectionList: [],
              historyList: [],
              historyKey: [],
              set: {
                name: '',
                nickName: '',
                gender: '',
                age: '',
                birthday: ''
              },
              avatarBgUrl: '../../common/images/avatar-bg2.jpg'
            }
          }).then(res => {
            console.log('用户信息添加成功！')
            // 将新增加到数据库的数据返回到此app.js中
            userCo.doc(res._id).get().then(res => {
              // console.log(res)
              self.globalData.userId = res.data._id
              delete res.data._id
              delete res.data._openid
              self.globalData.userMovieInfo = delete res.data
            })
          })
        }
      })
  },

  // 小程序从前台进入后台，触发 onHide方法
  // onHide监听页面隐藏，当从当前A页跳转到其他页面，那么A页面处于隐藏状态。
  onHide() {
    const self = this
    // 当app切入后台时，向数据库更新用户电影信息
    const userCo = wx.cloud.database().collection('user')
    userCo.doc(self.globalData.userId).set({
      data:self.globalData.userMovieInfo
    }).then(res => {
      if (res.stats.updated === 1) {
        console.log('用户数据更新成功！')
      }
    })
    console.log('105')
    self.updataSortArr(self)
  },

  updataSortArr(app) {
    //向云函数传递历史记录标签参数
    const historyList=app.globalData.userMovieInfo.historyList
    //预告片历史记录类型统计 对象数组type，account
    let sortObj={}
    let sortArr=[]
    historyList.forEach((el,index)=>{
      let typeArr=[]
      const typeStr=el.type
      for(let i=0;i<typeStr.length;i+=2){
        typeArr.push(typeStr.substring(i,i+2))
      }
      typeArr.forEach(el=>{
        if(el in sortObj){
          sortObj[el]++
        }else{
          sortObj[el] = 1
        }
      })
    })


    //把对象转换成对象数组（数组里面的成员是对象）
    for(let type in sortObj){
      sortArr.push({
        type:type,
        count:sortObj[type]
      })
    }
    //将数组降序排列
    const sortArrayByCount=function(type1,type2){
      return type2.count-type1.count
    }
    sortArr.sort(sortArrayByCount)
    console.log(sortArr)

    //给后台云函数recommend传过去一个已排序好的电影类型对应权重的对象数组
    wx.cloud.callFunction({
      name:'recommend',
      data:{
        typeArr:sortArr
      }
    })
  }


})
