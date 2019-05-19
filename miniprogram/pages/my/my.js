const app = getApp();
var obj = app.globalData
wx.cloud.init()
Page({
    data: {
        userMovieInfo: {},
        avatarSrc: '../../common/images/avatar.png',
        userInfoFlag: true,
        avatarName: '',
    },
    onLoad(options) {
        const self = this
        const userInfo = app.globalData.userInfo
        // console.log(app.globalData.userInfo);
        
        //如果已获得userInfo
        if (userInfo) {
            self.setData({
                avatarSrc: userInfo.avatarUrl,
                avatarName: userInfo.nickName,
                // userInfoFlag: true
            })
        } else {
            self.setData({
                userInfoFlag: false
            })
        }
        // console.log(userInfo)
        const userMovieInfo = app.globalData.userMovieInfo
        let historyList = userMovieInfo.historyList
        // console.log(historyList)
        //对电影名字进行处理
        if (historyList.length > 0) {
            historyList.forEach(el => {
                // indexOf() 方法返回调用  String 对象中第一次出现的指定值的索引，开始在 fromIndex进行搜索。
                const movieNameIndex = el.name.indexOf(" ")
                if (movieNameIndex != -1) {
                    el.name = el.name.substring(0, movieNameIndex)
                }
            })
        }

        let collectionList = userMovieInfo.collectionList
        if (collectionList.length > 0) {
            collectionList.forEach(el => {
                const movieNameIndex = el.name.indexOf(" ")
                if (movieNameIndex != -1) {
                    el.name = el.name.substring(0, movieNameIndex)
                }
            })
        }
        self.setData({
            userMovieInfo: userMovieInfo
        })
    },
    onShow() {
        const self=this
        const userMovieInfo = app.globalData.userMovieInfo
        let historyList = userMovieInfo.historyList
        //对电影名字进行处理
        if (historyList.length > 0) {
            historyList.forEach(el => {
                // indexOf() 方法返回调用  String 对象中第一次出现的指定值的索引，开始在 fromIndex进行搜索。
                const movieNameIndex = el.name.indexOf(" ")
                if (movieNameIndex != -1) {
                    el.name = el.name.substring(0, movieNameIndex)
                }
            })
        }

        let collectionList = userMovieInfo.collectionList
        if (collectionList.length > 0) {
            collectionList.forEach(el => {
                const movieNameIndex = el.name.indexOf(" ")
                if (movieNameIndex != -1) {
                    el.name = el.name.substring(0, movieNameIndex)
                }
            })
        }
        self.setData({
            userMovieInfo: userMovieInfo
        })
    },
    getuserinfo(res) {
        const self = this
        const userInfo = app.globalData.userInfo
        console.log(userInfo)
        self.setData({
            avatarSrc: userInfo.avatarUrl,
            avatarName: userInfo.nickName,
            userInfoFlag: true
        })
        //同步用户数据
        app.globalData.userInfo=userInfo
    },
    goDetail(e) {
        const id=e.currentTarget.dataset.id
        const type=e.currentTarget.dataset.type

        wx.navigateTo({
            url:'../detail/detail?id='+id+'&type='+type
        })
    },
    choseBg() {
        wx.navigateTo({
            url: '../avatarBg/avatarBg'
        })
        console.log("chooseBg")
    },
    goSetting() {
        wx.navigateTo({
            url: '../setting/setting'
        })
    }
})