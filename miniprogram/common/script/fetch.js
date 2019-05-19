function fetchDetail(collection, id, handle, handle_fail) {
    const movieCo = wx.cloud.database().collection(collection)
    movieCo.doc(id).get()
        .then(res => {
            typeof handle === 'function' && handle(res.data)
        })
}

function fetchTypeList(collection, start, type, handle, handle_fail) {
    const reqMaxCount = 5 //一次加载预告片最大数量
    const self = this
    const movieCo = wx.cloud.database().collection(collection)
    const typeRE = new RegExp(type)
    setTimeout(() => {
        movieCo.where({
            type: typeRE
        })
            .skip(start).limit(reqMaxCount).get()
            .then(res => {
                if (res.data.length < reqMaxCount) {
                    self.setData({
                        hasMore: false,
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                } else {
                    self.setData({
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                }
                typeof handle === 'function' && handle(res.data)
                self.setData({
                    showLoading: false
                })
            }).catch(err => {
                typeof handle_fail === 'function' && handle_fail()
                self.setData({
                    showLoading: false
                })
                console.log(err)
            })
    }, 500)//模拟网络延迟
}


function fetchMovieList(collection, start, handle, handle_fail) {
    const self = this
    const reqMaxCount = 5 //一次加载预告片最大数量
    const movieCo = wx.cloud.database().collection(collection)
    setTimeout(() => {
        movieCo.skip(start).limit(reqMaxCount).get()
            .then(res => {
                if (res.data.length < reqMaxCount) {
                    self.setData({
                        hasMore: false,
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                } else {
                    self.setData({
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                }
                typeof handle==='function' && handle(res.data)
                self.setData({
                    showLoading: false
                })
            })
            .catch(err=>{
                typeof handle_fail === 'function' && handle_fail()
                self.setData({
                    showLoading: false
                })
                console.log(err)
            })
    }, 500)
}



function fetchSearchResult(collection,start,key,handle,handle_fail){
    const reqMaxCount = 5 //一次加载预告片最大数量
    const self = this
    const movieCo = wx.cloud.database().collection(collection)
    const keyRE = new RegExp(key)
    setTimeout(() => {
        movieCo.where({
            name: keyRE
        })
            .skip(start).limit(reqMaxCount).get()
            .then(res => {
                if (res.data.length < reqMaxCount) {
                    self.setData({
                        hasMore: false,
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                } else {
                    self.setData({
                        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                    })
                }
                typeof handle === 'function' && handle(res.data)
                self.setData({
                    showLoading: false
                })
            }).catch(err => {
                typeof handle_fail === 'function' && handle_fail()
                self.setData({
                    showLoading: false
                })
                console.log(err)
            })
    }, 500)//模拟网络延迟
}
module.exports = {
    fetchDetail,
    fetchTypeList,
    fetchMovieList,
    fetchSearchResult
}