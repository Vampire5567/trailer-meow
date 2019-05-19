// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const movieCo=cloud.database().collection('movieHot')
  const movieDetail=await movieCo.doc(event.id).get()
  let danmuList=movieDetail.data.danmuList
 

  //将传进来的text和time加进数组
  danmuList.push({
    color:event.color,
    text:event.text,
    time:event.time
  })
console.log(danmuList)
  //更新danmuList数组在云端
  const res=await movieCo.doc(event.id).update({
    data:{
      danmuList:danmuList
    }
  })
  return event
}