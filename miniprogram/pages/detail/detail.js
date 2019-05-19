const fetch = require('../../common/script/fetch')
const app = getApp()
wx.cloud.init()
Page({
  videoContext: '',
  danmuValue: '',
  id: '',
  type: '',
  collection: 'movieHot',
  videoCurrenTime: 0,
  data: {
    descContent: 'desc-content-fold',
    showLoading: true,
    movieDetail: null,
    likeList: [],
    isCollection: { //收藏预告片
      flag: false,
      color: 'grey',
      text: '收藏'
    },
    danmudisabled: false, //弹幕是否可以发送
    inputDanmu: '',//初始化弹幕

  },


  onLoad: function (options) {
    const self = this
    self.id = options.id;
    const args = ['movieHot', self.id, self.handleDataDetail]
    fetch.fetchDetail.apply(self, args)
    //设置此页面可分享
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  //小程序进入后台时暂停播放
  onHide: function () {
    this.videoContext = wx.createVideoContext('movieVideo')
    this.videoContext.pause()
  },
  handleDataDetail(data) {
    const self = this
    self.setData({
      movieDetail: data,
      showLoading: false
    })

    //将此电影添加作为历史记录到app全局变量中
    const currentMovie = self.data.movieDetail
    let historyList = app.globalData.userMovieInfo.historyList

    if (historyList.length > 0) {
      // 把重复的历史电影去掉
      historyList = historyList.filter(el => {
        if (el._id !== currentMovie._id)
          return el
      })
      if (historyList.length >= 20) {
        historyList = historyList.splice(0, 19)
      }
    }
    historyList.unshift(currentMovie)
    app.globalData.userMovieInfo.historyList = historyList

    //获取相似电影预告片
    const typeStr = data.type //电影类型字符串
    let typeArr = []  //保存电影类型数据的数组
    let rowLikeListArr = [] //保存各个类型获取到的相似电影列表（每个电影类型获取到的电影数据作为数组的一个元素）
    let flag = 0 //判断数据库查询是否完成
    const typeStrLen = typeStr.length / 2
    for (let i = 0; i < typeStrLen; i++) {//遍历数组，访问数据库查询相似类型电影
      const item = typeStr.substring(2 * i, 2 * (i + 1))

      wx.cloud.callFunction({
        name: 'fetchLike',
        data: {
          type: item,
          collection: 'movieHot'
        }
      }).then(res => {
        let likeList = res.result.likeList.data
        if (likeList.length > 0 && rowLikeListArr.length < 5) {
          rowLikeListArr.push(likeList)
          typeArr.push(item)
        }
        flag++

      })
    }
    //间隔100ms执行函数，判断数据库查询是否完成
    const time = setInterval(() => {
      if (flag == typeStrLen) { //即数据库查询完成
        let likeListSelect = [] //保存处理过的相似电影数据，用来渲染页面
        const maxLikeListSelectLength = 5 //展示最大的相似电影数量
        let rowLikeListAllLength = 0 //获取到所有类型的所有电影数据的数量

        rowLikeListArr.forEach(el => {
          // 获取所有类型电影的个数
          rowLikeListAllLength = rowLikeListAllLength + el.length

        })
        // 如果所有类型电影小于5个，就把这些电影都给likeListSelect
        if (rowLikeListAllLength <= maxLikeListSelectLength) {
          rowLikeListArr.forEach(el => {
            el.forEach(typeItem => {
              likeListSelect.push(typeItem)
            })
          })
        } else {

          const rowLikeListLength = rowLikeListArr.length //查询到的电影类型数
          const loopCount = Math.ceil(maxLikeListSelectLength / rowLikeListLength) //对相似电影原始数据遍历次数

          let restNum = maxLikeListSelectLength //需要补充到likeListSelect的个数
          for (let i = 0; i < loopCount; i++) {
            // 得到likeListSelect
            rowLikeListArr.forEach((el, index) => {
              if (restNum > 0 && el.length > 0) {
                const randomIndex = Math.floor(Math.random() * el.length)
                const randomItem = el[randomIndex]
                //将随机渠道的元素从电影类型数组删除
                el.splice(randomIndex, 1)

                //判断数组里面的是否重复
                // concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
                const duplicatePattern = likeListSelect.concat(data)
                let isDuplicate = false
                // some() 方法测试是否至少有一个元素通过由提供的函数实现的测试。
                isDuplicate = duplicatePattern.some(el => {
                  return randomItem._id === duplicatePattern._id
                })
                if (!isDuplicate) {
                  likeListSelect.push(randomItem)
                  restNum--
                }
              }


            })
          }

        }
        likeListSelect.forEach(element => {
          let duration = element.duration
          let minute = Math.floor(duration / 60)
          minute = minute < 10 ? "0" + minute : minute
          let second = parseInt(duration % 60)
          second = second < 10 ? "0" + second : second
          let durationDec = minute + "'" + second + "''"
          element.duration = durationDec
        })
        self.setData({
          likeList: likeListSelect
        })

        clearInterval(time)
      }
    }, 100)

    const collectionList = app.globalData.userMovieInfo.collectionList
    if (collectionList.some(el => el._id === currentMovie._id)) {
      self.setData({
        isCollection: { //收藏预告片
          flag: true,
          color: 'green',
          text: '已收藏'
        }
      })
    }
    self.videoContext = wx.createVideoContext('movieVideo')
    self.videoContext.play()
  },
  foldToggle() {
    if (this.data.descContent === 'desc-content-fold') {
      this.setData({
        descContent: 'desc-content-unfold'
      })
    } else {
      this.setData({
        descContent: 'desc-content-fold'
      })
    }
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type

    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&type=' + type
    })
  },
  videoTimeUpdate(e) {
    const self = this
    if (self.data.danmudisabled) {
      self.videoCurrenTime = Math.ceil(e.detail.currentTime)
    }
  },
  danmuBlur(e) {
    //设置这个函数是为了获取输入框的值
    this.danmuValue = e.detail.value
  },
  getRandomColor() {
    const rbg = []
    for (let i = 0; i < 3; i++) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rbg.push(color)
    }
    return '#' + rbg.join('')
  },
  sendDanmu(e) {
    // 先初始化弹幕
    const self = this
    self.setData({
      danmudisabled: true
    })
    setTimeout(() => {
      self.setData({
        danmudisabled: false
      })
    }, 500)
    self.setData({
      inputDanmu: ''
    })

    setTimeout(() => {
      const color = self.getRandomColor()
      //前台发送弹幕
      self.videoContext.sendDanmu({
        text: self.danmuValue,
        color: color
      })
      //后台将弹幕内容添加到数据库
      wx.cloud.callFunction({
        name: 'addDanmu',
        data: {
          color: self.getRandomColor(),
          text: self.danmuValue,
          time: self.videoCurrenTime,
          id: self.id,
          collection: self.collection
        }
      }).then(res => {
        console.log('弹幕发送成功')
      })
    }, 250)
  },
  collectionToggle() {
    const self = this
    let currentMovie = self.data.movieDetail
    let collectionList = app.globalData.userMovieInfo.collectionList
    if (self.data.isCollection.flag) {//已收藏，点击转换成收藏
      self.setData({
        isCollection: { //收藏预告片
          flag: false,
          color: 'grey',
          text: '收藏'
        }
      })
      //同步全局变量collectionList，将电影从collectionList删掉
      let currentIndex
      collectionList.forEach((el, index) => {
        if (el._id === currentMovie._id) {
          currentIndex === index
        }
        collectionList.splice(currentIndex,1)
      })
    }else {//未收藏，点击转换成已收藏
      self.setData({
        isCollection: { //收藏预告片
          flag: true,
          color: '#09BB07',
          text: '已收藏'
        }
      })
      //同步全局变量到collectionList,将电影加到collectionList，并做一些处理
      if(collectionList.length>=10){
        collectionList.slice(0,9)
      }
      collectionList.unshift(currentMovie)
    }
    //将数据同步给全局变量
    app.globalData.userMovieInfo.collectionList=collectionList
    // console.log(collectionList)
  }
})