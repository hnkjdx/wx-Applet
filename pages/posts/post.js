var postsData = require('../../data/posts-data.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options 为页面跳转所带来的参数
   
    // this.data.postList = postsData.postList
   this.setData({
     postList:postsData.postList
   });
  },
 onPostTap:function(event){
   var postId = event.currentTarget.dataset.postid;
   wx.navigateTo({
     url: "post-detail/post-detail?id=" + postId
   })
 },

  onSwiperTap:function(event){
    // target指的是当前点击的组件 和currentTarge 指的是事件捕获的组件
    // target这里指的是image,而currentTarget指的是swiper
  var postId = event.target.dataset.postid;
  wx.navigateTo({
    url: "post-detail/post-detail?id=" + postId
  })
},





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onready")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})