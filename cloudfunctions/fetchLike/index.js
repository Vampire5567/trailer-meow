// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const typeRE=new RegExp(event.type)
  //相似的电影
 const likeList=await db.collection(event.collection).where({
   type:typeRE
 }).get()
 return {
   likeList
 }
}