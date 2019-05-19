// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const movieHotCo=cloud.database().collection('movieHot')
const userCo=cloud.database().collection('user')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const typeArr=event.typeArr

  //将用户类型权重数组改成对象表示，提高性能
  const typeObj={}
  const ipttTypeArr=['音乐','动画','科幻','喜剧','爱情','传记','惊悚']
  typeArr.forEach(element => {
    const count=ipttTypeArr.includes(element.type)?element.count*2:element.count
    typeObj[element.type]=count
  })

  //获取数据库所有电影资源  因为限制一次只能获取100条 所以需要多次获取
  const limitMax=100
  // count统计集合记录数或统计查询语句对应的结果记录数,返回tatal，是个结果数量，类型为number
  const docCountData=await movieHotCo.count()
  const docCountRes=docCountData.total

  // 批处理次数,向下取整,计算需要分几次取
  const batchTimes=Math.ceil(docCountRes/limitMax)
  let tasks=[]
  for(let i=0;i<batchTimes;i++){
    const promise=movieHotCo.skip(i*limitMax).limit(limitMax).get()
    tasks.push(promise)
  }

//等待所有
  const movieData=await Promise.all(tasks)

  let movieList=[]
  movieData.forEach(element=>{
    movieList=movieList.concat(element.data)
  })

  //为电影资源增加相对于用户的权重属性
   movieList.forEach(element=>{
    //  将电影列表里面每个电影的类型字符串转换成类型数组
     const typeStr=element.type//喜剧动画动作爱情亲情友情
     let typeArr=[]
     for(let i=0;i<typeStr.length;i+=2){
       typeArr.push(typeStr.substring(i,i+2))
     }
     let typeValue=0   //电影相对于用户的权重

     typeArr.forEach(typeItem=>{
       if(typeItem in typeObj){
         typeValue+=typeObj[typeItem]
       }
     })

     element.typeValue=typeValue
   })

   //电影列表按照typeValue降序排列
   movieList.sort((item1,item2)=>{
     return item2.typeValue-item1.typeValue
   })

   //将recommendList上传到数据库
   const test=await userCo.where({
     _openid:wxContext.OPENID
   }).update({
     data:{
      recommendList:movieList.slice(0,50)
     }
   })
}